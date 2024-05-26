import {Context, Session} from "koishi";
import {APIService} from "../../service";
import {BSRelateOAuthAccount} from "../../tables";


export const handleBeatLeaderBind = async (ctx:Context,api:APIService,{session,options}:{session: Session<'id',never, Context>, options:{}}, input:string) => {

  let tokenInfo = await api.AIOSaber
    .wrapperResult()
    .getBLOAuthToken(input)
  if(!tokenInfo.isSuccess()) {
    session.sendQuote(session.text("commands.bsbot.bind.bl.not-found"))
    return
  }
  let token = tokenInfo.data
  let self = await api.BeatLeader.wrapperResult().getTokenInfo(token.access_token)
  if(!self.isSuccess()) {
    const refreshToken = await api.BeatLeader.wrapperResult().refreshOAuthToken(token.refresh_token)
    if(!refreshToken.isSuccess()) {
      session.sendQuote(session.text('commands.bsbot.bind.bl.invalid-token'))
      return
    }
    token = refreshToken.data
    self = await api.BeatLeader
      .withRetry(3)
      .wrapperResult()
      .getTokenInfo(token.access_token)
    if(!self.isSuccess()) {
      session.sendQuote(session.text('commands.bsbot.bind.bl.unknown-error'))
      return
    }
  }
  let now = new Date()
  const res =await ctx.database.get('BSRelateOAuthAccount',
    {
      uid: session.user.id,
      platform: 'beatleader'
  })
  let account:Partial<BSRelateOAuthAccount> = {
    uid: session.user.id,
    platform: 'beatleader',
    platformScope: "profile clan offline_access",
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
    session.text('commands.bsbot.bind.bl.success', {name: self.data.name, id: self.data.id})
  )
}
