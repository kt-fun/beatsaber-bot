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
          session.text("commands.bsbot.bindbs.not-found")
        ))
        return
      }
      let token = tokenInfo.data
      let self = await api.BeatSaver.getTokenInfo(token.access_token)
      if(!self.isSuccess()) {
        const refreshToken = await api.BeatSaver.refreshOAuthToken(token.refresh_token)
        if(!refreshToken.isSuccess()) {

          session.sendQueued(h('message',[
            h('quote', {id: session.messageId}),
            session.text('commands.bsbot.bindbs.invalid-token')
          ]))
          return
        }
        token = refreshToken.data

        self = await api.withRetry(()=>api.BeatSaver.getTokenInfo(token.access_token), 3)
        if(!self.isSuccess()) {
          session.sendQueued(h('message',[
            h('quote', {id: session.messageId}),
            session.text('commands.bsbot.bindbs.unknown-error')
          ]))
          return
        }
      }
      let now = new Date()

      const res =await ctx.database.get('BeatSaverOAuthAccount', {
        uid: session.user.id,
      })

      let account:any = {
        uid: session.user.id,
        bsUserId: self.data.id,
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
      session.sendQueued(h('message', [
        h('quote', {id: session.messageId}),
        session.text('commands.bsbot.bindbs.success', {name: self.data.name, id: self.data.id})
      ]))
    })
}
