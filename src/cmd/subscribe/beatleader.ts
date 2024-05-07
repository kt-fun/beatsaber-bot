import {Context, h, Query,Session} from "koishi";
import {APIService} from "../../service";

export const beatleader = async (ctx:Context, api:APIService, { session, options }, input) => {

  const beatLeaderSubScribe= await ctx.database.get('BSBotSubscribe', {
    type: 'beatleader',
    selfId: session.selfId,
    platform: session.platform,
    channelId: session.channelId,
  })


  if(beatLeaderSubScribe.length > 0) {
    const sub = beatLeaderSubScribe[0]
    if(sub.enable) {
      session.sendQueued(h('message', [
        h('quote', {id:session.messageId}),
        session.text('commands.bsbot.subscribe.beatleader.exist')
      ]))
      return
    }
    let data = {...sub, enable: true}
    await ctx.database.upsert('BSBotSubscribe', [data])
    session.sendQueued(h('message', [
      h('quote', {id:session.messageId}),
      session.text('commands.bsbot.subscribe.beatleader.success')
    ]))
    return
  }
  const sub = {
    channelId: session.channelId,
    selfId: session.selfId,
    platform: session.platform,
    enable: true,
    uid: session.uid,
    type: 'beatleader',
    data: {}
  }
  await ctx.database.upsert('BSBotSubscribe', [sub])
  session.sendQueued(h('message', [
    h('quote', {id:session.messageId}),
    session.text('commands.bsbot.subscribe.beatleader.success')
  ]))
}
