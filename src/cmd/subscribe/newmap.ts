import {Context, h, Session} from "koishi";


export const newmap = async (ctx:Context, api, { session, options }, input) => {
  // let channelSub = false
  // if(session.event?.channel && session.event?.subtype != 'private'){
  //   const member = session.event.member
  //   if(!member.roles.includes("owner")) {
  //     session.send(session.text('commands.bsbot.subscribe.channel.error'))
  //     return
  //   }
  //   channelSub = true
  // }
  //
  // let userIds = input.split(",")
  // if(userIds.includes('all')){
  //   const  res = await ctx.database.upsert("BSBotSubscribe", [{
  //     "uid": session.userId,
  //     'channelId': channelSub ? session.event.channel.id:null,
  //     "platform": session.platform,
  //     "selfId": session.bot.selfId
  //   }])
  //   session.send(
  //     h('message',
  //       h('quote', {id:session.messageId}),
  //       session.text('commands.bsbot.subscribe.all.success'),
  //     )
  //   )
  //   return
  // }
  // const failedUserIds: {
  //   reason: string,
  //   userIds: string[],
  // }[] = []
  // const invalidUserIds = userIds.filter(item=> !item.match(/[0-9]+/))
  // if(invalidUserIds.length>0) {
  //   failedUserIds.push({
  //     reason: session.text('commands.bsbot.subscribe.reason.invalid-id'),
  //     userIds: invalidUserIds
  //   })
  // }
  //
  // const matchedUserIds = userIds.filter(item=> item.match(/[0-9]+/))
  // let overflowUserId = matchedUserIds.splice(5)
  // if(overflowUserId.length>0) {
  //   failedUserIds.push({
  //     reason: session.text('commands.bsbot.subscribe.reason.too-many-id'),
  //     userIds: overflowUserId
  //   })
  // }
  // const filteredUserIds = matchedUserIds.slice(0,5)
  // const resp = await Promise.all(filteredUserIds.map((it:string)=> api.BeatSaver.getBSMapperById(it)))
  // const result = resp
  //   .map((value, index)=>{
  //     return {
  //       idx: index,
  //       value: value
  //     }
  //   })
  // const requestFailed = result.filter(item=>item.value == null)
  //   .map(item=> filteredUserIds[item.idx])
  // if(requestFailed.length>0) {
  //   failedUserIds.push({
  //     reason: session.text('commands.bsbot.subscribe.reason.req-failed'),
  //     userIds: requestFailed
  //   })
  // }
  // const dbData = result.filter(item=>item.value != null)
  //   .map(item=>item.value)
  //   .map(item=>({
  //     "uid": session.userId,
  //     'channelId': channelSub ? session.event.channel.id:null,
  //     "platform": session.platform,
  //     "selfId": session.bot.selfId
  //   }))
  // await ctx.database.upsert("BSBotSubscribe", dbData)
  // if (failedUserIds.length > 0) {
  //   session.send(
  //     h(
  //       'message',
  //       h('quote', {id:session.messageId}),
  //       failedUserIds.map(it=>
  //         h('p',
  //           `${it.reason} ${session.text('commands.bsbot.subscribe.error-unhandled')} ${it.userIds.join(",")}`
  //         )
  //       )
  //     )
  //   )
  // }
  // if (dbData.length > 0) {
  //   session.send(
  //     h('message',
  //       h('quote', {id:session.messageId}),
  //       session.text('commands.bsbot.subscribe.success'),
  //       dbData.map(item => h('p', item.bsUserId+":"+item.bsUsername)),
  //       session.text('commands.bsbot.subscribe.notify')
  //     )
  //   )
  // }
}
