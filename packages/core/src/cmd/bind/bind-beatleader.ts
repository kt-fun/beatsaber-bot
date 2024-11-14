import { CmdContext, RelateAccount } from '@/interface'

export const handleBeatLeaderBind = async <T, C>(c: CmdContext<T, C>) => {
  const tokenInfo = await c.api.AIOSaber.getBLOAuthToken(c.input)
  if (!tokenInfo) {
    c.session.sendQuote(c.session.text('commands.bsbot.bind.bl.not-found'))
    return
  }
  let token = tokenInfo
  let self = await c.api.BeatLeader.getTokenInfo(token.access_token)
  if (!self) {
    const refreshToken = await c.api.BeatLeader.refreshOAuthToken(
      token.refresh_token
    )
    if (!refreshToken) {
      c.session.sendQuote(
        c.session.text('commands.bsbot.bind.bl.invalid-token')
      )
      return
    }
    token = refreshToken
    self = await c.api.BeatLeader.getTokenInfo(token.access_token)
    if (!self) {
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
    platformUid: self.id,
    platformUname: self.name,
    otherPlatformInfo: {},
    accessToken: token.access_token,
    refreshToken: token.refresh_token,
    lastModifiedAt: now,
    lastRefreshAt: now,
    type: 'oauth',
    status: 'ok',
  }
  if (blAccount) {
    account.id = blAccount.id
  }

  await c.db.addUserBindingInfo(account)
  c.session.sendQuote(
    c.session.text('commands.bsbot.bind.bl.success', {
      name: self.name,
      id: self.id,
    })
  )
}
