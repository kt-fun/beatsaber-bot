import { CmdContext, RelateAccount } from '@/interface'

export const handleBeatSaverBind = async <T, C>(c: CmdContext<T, C>) => {
  const tokenInfo = await c.api.AIOSaber.getBSOAuthToken(c.input)
  if (!tokenInfo) {
    c.session.sendQuote(c.session.text('commands.bsbot.bind.bs.not-found'))
    return
  }
  let token = tokenInfo
  let self = await c.api.BeatSaver.getTokenInfo(token.access_token)
  // .catch((e) => {
  //   return c.api.BeatSaver.refreshOAuthToken(token.refresh_token)
  // })
  // .catch((e) =>
  //   c.session.sendQuote(
  //     c.session.text('commands.bsbot.bind.bs.invalid-token')
  //   )
  // )
  if (!self) {
    const refreshToken = await c.api.BeatSaver.refreshOAuthToken(
      token.refresh_token
    )
    if (!refreshToken) {
      c.session.sendQuote(
        c.session.text('commands.bsbot.bind.bs.invalid-token')
      )
      return
    }
    token = refreshToken
    self = await c.api.BeatSaver.getTokenInfo(token.access_token)
    // if (!self.isSuccess()) {
    //   c.session.sendQuote(
    //     c.session.text('commands.bsbot.bind.bs.unknown-error')
    //   )
    //   return
    // }
  }
  const now = new Date()
  const { bsAccount } = await c.db.getUserAccountsByUid(c.session.u.id)
  const account: Partial<RelateAccount> = {
    uid: c.session.u.id,
    platform: 'beatsaver',
    platformUid: self.id,
    platformUname: self.name,
    otherPlatformInfo: {},
    platformScope: 'identity,alerts',
    accessToken: token.access_token,
    refreshToken: token.refresh_token,
    lastModifiedAt: now,
    lastRefreshAt: now,
    type: 'oauth',
    status: 'ok',
  }
  if (bsAccount) {
    account.id = bsAccount.id
  }
  await c.db.addUserBindingInfo(account)
  c.session.sendQuote(
    c.session.text('commands.bsbot.bind.bs.success', {
      name: self.name,
      id: self.id,
    })
  )
}
