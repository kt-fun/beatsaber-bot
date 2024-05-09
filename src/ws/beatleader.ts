import {$, Context, h, Logger} from "koishi";
import {Config} from "../config";
import {BeatLeaderWSEvent} from "../types/ws/beatleader";
import {RenderOpts, renderScore} from "../img-render";

export function BeatLeaderWS(ctx: Context, cfg:Config, logger:Logger) {
  const ws = ctx.http.ws("wss://sockets.api.beatleader.xyz/scores")
  ws.on('open', (code, reason)=> {
    logger.info("BeatleaderWS opened");
  })
  ws.on('message',async (message,isBinary)=> {
    try {
      const data = JSON.parse(message.toString()) as BeatLeaderWSEvent
      const playerId = data.player.id

      const ok = BeatLeaderReportChain(data,
        // RankOnly,
        // HighPP,
        // HighStar,
        // TopScore,
        StandardMode
      )
      if(!ok) {
        return
      }
      // logger.info('Received beatleader message',data.id, data.player.id);
      const selection = ctx.database.join(['BSSubscribeMember','user', 'BSBotSubscribe'])

      const subscribe = await selection.where(row=>
        $.and(
          $.eq(row.BSBotSubscribe.enable, true),
          $.eq(row.user.id,row.BSSubscribeMember.memberUid),
          $.eq(row.BSSubscribeMember.subscribeId, row.BSBotSubscribe.id),
          $.eq(row.user.bindSteamId, playerId),
          $.eq(row.BSBotSubscribe.type, 'beatleader'),
        )).execute()

      const subscribes = subscribe.map(item=> ({
        sub: item.BSBotSubscribe,
        member: item.BSSubscribeMember,
        user:item.user
      }))

      let renderOpts = {
        puppeteer:ctx.puppeteer,
        renderBaseURL: cfg.remoteRenderURL,
        onStartRender() {},
        platform: 'beat-leader',
        background: 'default',
        waitTimeout: cfg.rankWaitTimeout,
      } satisfies RenderOpts
      for (const item of subscribes) {
          const bot = ctx.bots[`${item.sub.platform}:${item.sub.selfId}`]
          if(!bot) continue
          const img = await renderScore(data.id.toString(), renderOpts)
          const res = await ctx.database.get('binding', {
            platform: item.sub.platform,
            aid: item.member.memberUid
          })
          bot.sendMessage(item.sub.channelId, h('message', [
            "恭喜",
            h('at', {id: res[0].pid,}),
            `刚刚在谱面「${data.leaderboard.song.name}」中打出了 ${(data.accuracy * 100).toFixed(2)}% 的好成绩`
          ]))
          bot.sendMessage(item.sub.channelId, h('message', [img]))
      }
    }catch(err) {
      logger.info('err',err)
    }
  })

  ws.on('close', (code, reason)=> {
    logger.info("BeatleaderWS closed");
  })

  return ws
}



const filterMap = {
  'rank-only': RankOnly
}

function RankOnly(event:BeatLeaderWSEvent) {
  return event.pp != 0
}

function HugeImprove(event:BeatLeaderWSEvent) {
  return event.rankVoting != null
}
function HighStar(event:BeatLeaderWSEvent) {
  return event.leaderboard.difficulty.stars >= 9
}
function StandardMode (event:BeatLeaderWSEvent) {
  return event.leaderboard.difficulty.modeName === "Standard"
}
function HighPP(event:BeatLeaderWSEvent) {
  return event.pp > 300
}
function TopScore(event:BeatLeaderWSEvent) {
  return event.rank != 0  && event.rank <= 30
}

function BeatLeaderReportChain(event:BeatLeaderWSEvent,...fc:((event:BeatLeaderWSEvent)=>boolean)[]) {
  for(const item of fc) {
    const res = item(event)
    if(!res) return false
  }
  return true
}
