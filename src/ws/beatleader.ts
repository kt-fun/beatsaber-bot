import {$, Context, h, Logger} from "koishi";
import {Config} from "../config";
import {BeatLeaderWSEvent} from "../types/api";
import {BeatLeaderFilter} from "./bl-filter";
import {Platform} from "../types";
import {APIService, RenderService} from "../service";

export function BeatLeaderWS(ctx: Context, cfg:Config,render:RenderService, logger:Logger) {

  const ws = ctx.http.ws("wss://sockets.api.beatleader.xyz/scores") as any
  ws.on('open', (event)=> {
    logger.info("BeatleaderWS opened");
  })
  ws.on('message',async (message, isBinary)=> {
    try {
      const data = JSON.parse(message.toString()) as BeatLeaderWSEvent
      const playerId = data.player.id
      const ok = BeatLeaderFilter(data, ...cfg.BLScoreFilters)
      if(!ok) {
        return
      }
      // logger.info('Received beatleader message',data.id, data.player.id);
      const selection = ctx.database.join(['BSSubscribeMember','BSRelateOAuthAccount','user', 'BSBotSubscribe'])
      const subscribe = await selection.where(row=>
        $.and(
          $.eq(row.BSBotSubscribe.enable, true),
          $.eq(row.user.id,row.BSRelateOAuthAccount.uid),
          $.eq(row.user.id,row.BSSubscribeMember.memberUid),
          $.eq(row.BSSubscribeMember.subscribeId, row.BSBotSubscribe.id),
          $.eq(row.BSRelateOAuthAccount.platformUid, playerId),
          $.eq(row.BSBotSubscribe.type, 'beatleader'),
          $.eq(row.BSRelateOAuthAccount.platform, 'beatleader'),
        )).execute()


      const subscribes = subscribe.map(item=> ({
        sub: item.BSBotSubscribe,
        member: item.BSSubscribeMember,
        user:item.user,
        account: item.BSRelateOAuthAccount
      }))
      // .filter(item=> {
      //   const channelFilters = item.sub.data as BLScoreFilter[]
      //   const memberFilters = item.member.subscribeData
      //   return BeatLeaderFilter(data, ...channelFilters, ...memberFilters)
      // })
      for (const item of subscribes) {
          const bot = ctx.bots[`${item.sub.platform}:${item.sub.selfId}`]
          if(!bot) continue
          const img = await render.renderScore(data.id.toString(),Platform.BL)
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

  ws.on('close', (evt)=> {
    logger.info("BeatleaderWS closed");
  })

  return ws
}

