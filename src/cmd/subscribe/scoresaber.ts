import {Context, h} from "koishi";
import {APIService} from "../../service";

export const scoresaber = async (ctx:Context, api:APIService, { session, options }, input) => {

  const scoresaberSubScribe= await ctx.database.get('BSBotSubscribe', {
    type: 'scoresaber',
    selfId: session.selfId,
    platform: session.platform,
    channelId: session.channelId,
  })
  if(scoresaberSubScribe.length > 0) {
    const sub = scoresaberSubScribe[0]
    if(sub.enable) {
      session.sendQueued(h('message', [h('quote', {id: session.messageId}),
        session.text('commands.bsbot.subscribe.scoresaber.exist')
      ]))
      return
    }
    let data = {...sub, enable: true}
    await ctx.database.upsert('BSBotSubscribe', [data])
    session.sendQueued(h('message', [h('quote', {id: session.messageId}),
      session.text('commands.bsbot.subscribe.scoresaber.success')
    ]))
    return
  }
  const sub = {
    channelId: session.channelId,
    selfId: session.selfId,
    platform: session.platform,
    uid: session.uid,
    enable: true,
    type: 'scoresaber',
    data: {}
  }
  await ctx.database.upsert('BSBotSubscribe', [sub])


  session.sendQueued(h('message', [h('quote', {id: session.messageId}),
    session.text('commands.bsbot.subscribe.scoresaber.success')
  ]))
}
