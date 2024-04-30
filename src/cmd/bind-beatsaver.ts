import {Context, h} from "koishi";
import {Config} from "../config";
import {APIService} from "../service";
import handlerError from "../utils/error";

interface TokenInfo {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export function BindBSCmd(ctx:Context,cfg:Config,api:APIService) {
  const bindBSCmd = ctx
    .command('bsbot.bindbs <key:text>')
    .alias('bbbindbs')
    .action(async ({ session, options }, input) => {
      let tokenInfo = await handlerError(session,async ()=> await api.AIOSaber.getBSOAuthToken(input))
      if(!tokenInfo) {
        session.send(h('message',
          h('quote', {id: session.messageId}),
          "什么都没找到"
        ))
        return
      }
      let token = tokenInfo as TokenInfo
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
      const alerts = await api.BeatSaver.getUnreadAlertsByPage(res[0].accessToken, 0)
      const lastId = alerts.length > 0 ? alerts[0].id : 0
      const sub = {
        channelId: session.channelId,
        selfId: session.selfId,
        platform: session.platform,
        lastNotifiedId: lastId,
        lastNotifiedAt: now,
        oauthAccountId: res[0].id,
      }
      await ctx.database.upsert('BeatSaverNotifySub', [sub])
      session.send("bind successfully")
    })
}
