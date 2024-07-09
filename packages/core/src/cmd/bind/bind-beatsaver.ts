import { CmdContext } from '@/interface'
import { RelateAccount } from '@/db'

export const handleBeatSaverBind = async <T, C>(c: CmdContext<T, C>) => {
  const tokenInfo = await c.api.AIOSaber.wrapperResult()
    .withRetry(3)
    .getBSOAuthToken(c.input)
  if (!tokenInfo.isSuccess()) {
    c.session.sendQuote(c.session.text('commands.bsbot.bind.bs.not-found'))
    return
  }
  let token = tokenInfo.data
  let self = await c.api.BeatSaver.wrapperResult().getTokenInfo(
    token.access_token
  )
  if (!self.isSuccess()) {
    const refreshToken =
      await c.api.BeatSaver.wrapperResult().refreshOAuthToken(
        token.refresh_token
      )
    if (!refreshToken.isSuccess()) {
      c.session.sendQuote(
        c.session.text('commands.bsbot.bind.bs.invalid-token')
      )
      return
    }
    token = refreshToken.data
    self = await c.api.BeatSaver.wrapperResult()
      .withRetry(3)
      .getTokenInfo(token.access_token)
    if (!self.isSuccess()) {
      c.session.sendQuote(
        c.session.text('commands.bsbot.bind.bs.unknown-error')
      )
      return
    }
  }
  const now = new Date()
  const { bsAccount } = await c.db.getUserAccountsByUid(c.session.u.id)
  const account: Partial<RelateAccount> = {
    uid: c.session.u.id,
    platform: 'beatsaver',
    platformScope: 'identity,alerts',
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
  if (bsAccount) {
    account.id = bsAccount.id
  }
  await c.db.addUserBindingInfo(account)
  c.session.sendQuote(
    c.session.text('commands.bsbot.bind.bs.success', {
      name: self.data.name,
      id: self.data.id,
    })
  )
}
