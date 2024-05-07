import {Context, h} from "koishi";
import {APIService} from "../../service";

export const beatsaver = async (ctx:Context, api:APIService, { session, options }, input) => {

  // 1. each channel only 1 enable
  const beatsaverSubScribe= await ctx.database.get('BSBotSubscribe', {
    type: 'beatsaver',
    selfId: session.selfId,
    platform: session.platform,
    channelId: session.channelId,
  })
  if(beatsaverSubScribe.length > 0) {
    const sub = beatsaverSubScribe[0]
    if(sub.enable) {
      session.sendQueued(h('message', [
        h('quote',
          {messageId:session.messageId},
          session.text('commands.bsbot.subscribe.beatsaver.exist')
        )
      ]))
      return
    }
    let data = {...sub, enable: true}
    await ctx.database.upsert('BSBotSubscribe', [data])
    session.sendQueued(h('message', [
      h('quote',
        {messageId:session.messageId},
        session.text('commands.bsbot.subscribe.beatsaver.success')
      )
    ]))
    return
  }
  const sub = {
    channelId: session.channelId,
    selfId: session.selfId,
    platform: session.platform,
    uid: session.uid,
    type: 'beatsaver',
    data: {}
  }
  await ctx.database.upsert('BSBotSubscribe', [sub])
  session.sendQueued(h('message', [
    h('quote',
      {messageId:session.messageId},
      session.text('commands.bsbot.subscribe.beatsaver.success')
    )
  ]))
}
