import {$, Context, h, Logger} from "koishi";
import {Config} from "../config";
import {BeatSaverWSEvent} from "../types";
import {renderMap} from "../img-render";

export function BeatSaverWS(ctx: Context, config:Config,logger:Logger) {
  const ws = ctx.http.ws(config.beatSaverWSURL ?? "wss://ws.beatsaver.com/maps")
  ws.on('open', (code, reason)=> {
    logger.info("BeatsaverWS opened");
  })
  ws.on("message", async (event)=>{
    // const data = MockBeatsaverWsEvent
    const data = JSON.parse(event.toString()) as BeatSaverWSEvent
    logger.info("Beatsaver message received", data.type, data?.msg?.id)
    if(data.type == "MAP_UPDATE") {
      const bsmap = data.msg
      if(!bsmap.versions.some(it=>it.state == "Published")) {
        return
      }
      // if(bsmap.declaredAi != "None") {
      //   return
      // }
      const userId = bsmap.uploader.id
      const selection = ctx.database.join(['BSBotSubscribe','BeatSaverOAuthAccount','BSSubscribeMember', 'user'])
      const subscribe = await selection.where(row=>
        $.and(
          $.eq(row.BSBotSubscribe.enable, true),
          $.eq(row.BSBotSubscribe.id,row.BSSubscribeMember.subscribeId),
          $.eq(row.BSBotSubscribe.type,"beatsaver"),
          $.eq(row.user.id,row.BSSubscribeMember.memberUid),
          $.eq(row.BeatSaverOAuthAccount.bsUserId, userId)
        )
      ).execute()

      const subscription = subscribe.map(item=> ({
        account:item.BeatSaverOAuthAccount,
        subscribe:item.BSBotSubscribe,
        member: item.BSSubscribeMember,
        user: item.user
      }))

      for (const item of subscription) {
        logger.info('send msg to', item.subscribe)
        const bot = ctx.bots[`${item.subscribe.platform}:${item.subscribe.selfId}`]
        if(!bot) {
          continue
        }
        let texts = []
        const res = await ctx.database.get('binding', {
          platform: item.subscribe.platform,
          aid: item.member.memberUid
        })
        if(res.length > 0) {
          logger.info('mapperId in platform', res[0].platform)
          texts = [`本群谱师`,h.at(res[0].pid), ` 刚刚发布了新谱面，「${bsmap.name}」`]
        }else {
          texts = [`谱师「${bsmap.uploader.name}」刚刚发布了新谱面，「${bsmap.name}」`]
        }

        let image = renderMap(bsmap,ctx,config)
        await bot.sendMessage(item.subscribe.channelId, h('message', texts))
        await bot.sendMessage(item.subscribe.channelId, await image)
        await bot.sendMessage(item.subscribe.channelId, h.audio(bsmap.versions[0].previewURL))
      }

      // const users = await ctx.database.get('BSSubscribeMember', {
      //   bsUserId: userId.toString(),
      // })
      // const filteredUsers= users.filter(it=>
      //   allUser.some(item=>
      //     it.channelId == item.channelId
      //     && it.uid == item.uid
      //     && it.platform == item.platform
      //   )
      // )
      // let needSend = allUser.concat(filteredUsers)

      // allUser.filter()

      // for (let idx = 0; idx < needSend.length; idx++) {
      //   const item = needSend[idx]
      //   const bot = ctx.bots[`${item.platform}:${item.selfId}`]
      //   if(!bot) {
      //     continue
      //   }
      //   let channel = false
      //   if(item.channelId) {
      //     channel = true
      //   }
      //   let image = renderMap(bsmap,ctx,config)
      //   console.log("send", bot.selfId, item.uid)
      //   const userId = item.uid?.split(":")
      //   const uid = userId[userId.length - 1]
      //   const channelId = item.channelId
      //   console.log("send", bot.selfId, item.uid, uid)
      //
      //   const text = bot.session().text('ws.subscribe.update',
      //     {
      //       username:item.username,
      //       mapperName: bsmap.uploader.name
      //   })
      //   if(channel) {
      //     await bot.sendMessage(channelId, text)
      //     await bot.sendMessage(channelId, await image)
      //       .then(r => console.log("res:",r))
      //       .catch((e)=>console.log(e))
      //     await bot.sendMessage(channelId, h.audio(bsmap.versions[0].previewURL))
      //       .then(r => console.log("res:",r))
      //       .catch((e)=>console.log(e))
      //   }else {
      //     await bot.sendPrivateMessage(uid, text)
      //     await bot.sendPrivateMessage(uid, await image)
      //       .then(r => console.log("res:",r))
      //       .catch((e)=>console.log(e))
      //     await bot.sendPrivateMessage(uid, h.audio(bsmap.versions[0].previewURL))
      //       .then(r => console.log("res:",r))
      //       .catch((e)=>console.log(e))
      //   }
      // }
    }
  })

  ws.on('close', (code, reason)=> {
    logger.info("BeatsaverWS closed");
  })
  return ws
}
