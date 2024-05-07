import {Context, h, Logger} from "koishi";
import {APIService} from "../../service";

export const alert = async (ctx:Context, api:APIService, { session, options }, input, logger:Logger) => {
  const res = await ctx.database.get('BeatSaverOAuthAccount', {
    uid: session.uid
  })
  if(res.length < 1) {
    session.sendQueued('message', [
      h('quote',
        {messageId:session.messageId},
        session.text('commands.bsbot.subscribe.alert.no-bind-bs-id')
      )
    ])
    return
  }
  let dbAccount = res[0]
  let alerts = await api.withRetry(() => api.BeatSaver.getUnreadAlertsByPage(dbAccount.accessToken, 0),2)
  if(!alerts.isSuccess()) {
    logger.info('accessToken invalid, try to refresh')
    const token = await api.BeatSaver.refreshOAuthToken(dbAccount.refreshToken)
    let now = new Date()
    if(!token.isSuccess()) {
      logger.info(`failed to refresh, invalid this account,${JSON.stringify(dbAccount)}`)
      dbAccount.valid = 'invalid'
      dbAccount.lastModifiedAt = now
      await ctx.database.upsert('BeatSaverOAuthAccount',[dbAccount])
      session.sendQueued(h('message', [
        h('quote', {id:session.messageId}),
        session.text("cmmands.bsbot.subscribe.alert.invalid-token")
      ]))
      return
    }

    logger.info(`refresh beatsaver token successfully ${dbAccount.id}`)
    dbAccount.accessToken = token.data.access_token
    dbAccount.refreshToken = token.data.refresh_token
    dbAccount.lastRefreshAt = now
    dbAccount.lastModifiedAt = now
    await ctx.database.upsert('BeatSaverOAuthAccount', [dbAccount])
    alerts = await api.BeatSaver.getUnreadAlertsByPage(dbAccount.accessToken,0)
  }
  if(!alerts.isSuccess()) {
    session.sendQueued(h('message', [
      h('quote', {id:session.messageId}),
      session.text("commands.bsbot.subscribe.alert.not-success")
    ]))
    return
  }
  const lastId = alerts.data.length > 0 ? alerts.data[0].id : 0
  const now = new Date()
  const sub = {
    channelId: session.channelId,
    selfId: session.selfId,
    platform: session.platform,
    uid: session.uid,
    type: 'alert',
    enable: true,
    data: {
      lastNotifiedId: lastId,
      lastNotifiedAt: now,
      oauthAccountId: res[0].id,
    }
  }
  await ctx.database.upsert('BSBotSubscribe', [sub])
  session.sendQueued(h('message', [
    h('quote', {id:session.messageId}),
    session.text("commands.bsbot.subscribe.alert.success")
  ]))
}
