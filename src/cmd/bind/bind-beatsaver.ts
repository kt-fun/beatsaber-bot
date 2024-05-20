import {Context, h, Logger, Session} from "koishi";
import {APIService} from "../../service";
import {BSRelateOAuthAccount} from "../../index";

export const handleBeatSaverBind = async (ctx:Context,api:APIService,{session,options}:{session: Session<'id',never, Context>, options:{}}, input:string) => {
  let tokenInfo = await api.withRetry(() => api.AIOSaber.getBSOAuthToken(input),3)
  if(!tokenInfo.isSuccess()) {
    session.sendQuote(session.text("commands.bsbot.bind.bs.not-found"))
    return
  }
  let token = tokenInfo.data
  let self = await api.BeatSaver.getTokenInfo(token.access_token)
  if(!self.isSuccess()) {
    const refreshToken = await api.BeatSaver.refreshOAuthToken(token.refresh_token)
    if(!refreshToken.isSuccess()) {
      session.sendQuote(session.text('commands.bsbot.bind.bs.invalid-token'))
      return
    }
    token = refreshToken.data
    self = await api.withRetry(()=>api.BeatSaver.getTokenInfo(token.access_token), 3)
    if(!self.isSuccess()) {
      session.sendQuote(session.text('commands.bsbot.bind.bs.unknown-error'))
      return
    }
  }
  let now = new Date()
  const res =await ctx.database.get('BSRelateOAuthAccount', {
    uid: session.user.id,
    platform: 'beatsaver'
  })
  let account:Partial<BSRelateOAuthAccount> = {
    uid: session.user.id,
    platform: 'beatsaver',
    platformScope: "identity,alerts",
    platformUid: self.data.id,
    platformUname: self.data.name,
    otherPlatformInfo: {},
    accessToken: token.access_token,
    refreshToken: token.refresh_token,
    lastModifiedAt: now,
    lastRefreshAt: now,
    type: 'oauth',
    valid: 'ok'
  }
  if(res.length > 0) {
    account.id = res[0].id
  }
  await ctx.database.upsert('BSRelateOAuthAccount', [account])
  session.sendQuote(
    session.text('commands.bsbot.bind.bs.success', {name: self.data.name, id: self.data.id})
  )
}
