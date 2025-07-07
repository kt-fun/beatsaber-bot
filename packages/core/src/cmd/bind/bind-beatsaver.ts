import { CmdContext, Account } from '@/interface'

export const handleBeatSaverBind = async (c: CmdContext) => {
  const tokenInfo = await c.services.api.AIOSaber.getBSOAuthToken(c.input)
  if (!tokenInfo) {
    c.session.sendQuote(c.session.text('commands.bsbot.bind.bs.not-found'))
    return
  }
  let token = tokenInfo
  let self = await c.services.api.BeatSaver.getTokenInfo(token.access_token)
  if (!self) {
    const refreshToken = await c.services.api.BeatSaver.refreshOAuthToken(
      token.refresh_token
    )
    if (!refreshToken) {
      c.session.sendQuote(
        c.session.text('commands.bsbot.bind.bs.invalid-token')
      )
      return
    }
    token = refreshToken
    self = await c.services.api.BeatSaver.getTokenInfo(token.access_token)
  }
  const now = new Date()
  const account: Partial<Account> = {
    userId: c.session.user.id,
    providerId: 'beatsaver',
    accountId: self.id,
    providerUsername: self.name,
    metadata: {},
    scope: 'identity,alerts',
    accessToken: token.access_token,
    refreshToken: token.refresh_token,
    lastModifiedAt: now,
    lastRefreshAt: now,
    type: 'oauth',
  }
  await c.services.db.addUserBindingInfo(account)
  c.session.sendQuote(
    c.session.text('commands.bsbot.bind.bs.success', {
      name: self.name,
      id: self.id,
    })
  )
}
