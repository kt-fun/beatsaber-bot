import {Context, h, Logger} from "koishi";
import {Config} from "../config";
import {APIService} from "../service";

export function BindBSCmd(ctx:Context,cfg:Config,api:APIService,logger:Logger) {
  const bindBSCmd = ctx
    .command('bsbot.bindbs <key:string>')
    .alias('bbbindbs')
    .userFields(['id'])
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

      const res =await ctx.database.get('BeatSaverOAuthAccount', {
        uid: session.user.id,
      })
      let account:any = {
        uid: session.user.id,
        accessToken: token.access_token,
        refreshToken: token.refresh_token,
        scope:"identity,alerts",
        lastModifiedAt: now,
        lastRefreshAt: now,
        valid: 'ok'
      }
      if(res.length > 0) {
        account.id = res[0].id
      }
      // query uid token
      await ctx.database.upsert('BeatSaverOAuthAccount', [account])
      session.sendQueued(session.text('commands.bsbot.bind-bs.success'))
    })
}
