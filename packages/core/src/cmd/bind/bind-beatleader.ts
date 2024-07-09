import { CmdContext } from '@/interface'
import { RelateAccount } from '@/db'

export const handleBeatLeaderBind = async <T, C>(c: CmdContext<T, C>) => {
  const tokenInfo = await c.api.AIOSaber.wrapperResult().getBLOAuthToken(
    c.input
  )
  if (!tokenInfo.isSuccess()) {
    c.session.sendQuote(c.session.text('commands.bsbot.bind.bl.not-found'))
    return
  }
  let token = tokenInfo.data
  let self = await c.api.BeatLeader.wrapperResult().getTokenInfo(
    token.access_token
  )
  if (!self.isSuccess()) {
    const refreshToken =
      await c.api.BeatLeader.wrapperResult().refreshOAuthToken(
        token.refresh_token
      )
    if (!refreshToken.isSuccess()) {
      c.session.sendQuote(
        c.session.text('commands.bsbot.bind.bl.invalid-token')
      )
      return
    }
    token = refreshToken.data
    self = await c.api.BeatLeader.withRetry(3)
      .wrapperResult()
      .getTokenInfo(token.access_token)
    if (!self.isSuccess()) {
      c.session.sendQuote(
        c.session.text('commands.bsbot.bind.bl.unknown-error')
      )
      return
    }
  }
  const now = new Date()
  const { blAccount } = await c.db.getUserAccountsByUid(c.session.u.id)
  const account: Partial<RelateAccount> = {
    uid: c.session.u.id,
    platform: 'beatleader',
    platformScope: 'profile clan offline_access',
    platformUid: self.data.id,
    platformUname: self.data.name,
    otherPlatformInfo: {},
    accessToken: token.access_token,
    refreshToken: token.refresh_token,
    lastModifiedAt: now,
    lastRefreshAt: now,
    type: 'oauth',
    valid: 'ok',
  }
  if (blAccount) {
    account.id = blAccount.id
  }

  await c.db.addUserBindingInfo(account)
  c.session.sendQuote(
    c.session.text('commands.bsbot.bind.bl.success', {
      name: self.data.name,
      id: self.data.id,
    })
  )
}
