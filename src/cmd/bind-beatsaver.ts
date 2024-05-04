import {Context, h, Logger} from "koishi";
import {Config} from "../config";
import {APIService} from "../service";

export function BindBSCmd(ctx:Context,cfg:Config,api:APIService,logger:Logger) {
  const bindBSCmd = ctx
    .command('bsbot.bindbs <key:string>')
    .alias('bbbindbs')
    .action(async ({ session, options }, input) => {
      let tokenInfo = await api.withRetry(() => api.AIOSaber.getBSOAuthToken(input),3)
      if(!tokenInfo.isSuccess()) {
        session.sendQueued(h('message',
          h('quote', {id: session.messageId}),
          "什么都没找到"
        ))
        return
      }
      let token = tokenInfo.data
      let now = new Date()
      const account = {
        uid: session.uid,
        accessToken: token.access_token,
        refreshToken: token.refresh_token,
        scope:"identity,alerts",
        lastModifiedAt: now,
        lastRefreshAt: now,
        valid: 'ok'
      }
      await ctx.database.upsert('BeatSaverOAuthAccount', [account])
      const res = await ctx.database.get('BeatSaverOAuthAccount', {
        uid: session.uid
      })
      session.sendQueued(session.text('commands.bsbot.bind-bs.success'))

      // const alerts = await api.withRetry(() => api.BeatSaver.getUnreadAlertsByPage(res[0].accessToken, 0),3)
      // if(!alerts.isSuccess()) {
      //   //   retry
      //  return
      // }
      // const lastId = alerts.data.length > 0 ? alerts.data[0].id : 0
      // const sub = {
      //   channelId: session.channelId,
      //   selfId: session.selfId,
      //   platform: session.platform,
      //   lastNotifiedId: lastId,
      //   lastNotifiedAt: now,
      //   oauthAccountId: res[0].id,
      // }
      // await ctx.database.upsert('BeatSaverNotifySub', [sub])

    })
}
