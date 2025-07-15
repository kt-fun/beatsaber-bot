import { Account } from '@/interface'
import {CmdContext} from "@/interface";

export const handleBeatLeaderBind = async (c: CmdContext) => {
  const tokenInfo = await c.services.api.AIOSaber.getBLOAuthToken(c.input)
  if (!tokenInfo) {
    c.session.sendQuote(c.session.text('commands.bsbot.bl.account.not-found'))
    return
  }
  let token = tokenInfo
  let self = await c.services.api.BeatLeader.getTokenInfo(token.access_token)
  if (!self) {
    const refreshToken = await c.services.api.BeatLeader.refreshOAuthToken(
      token.refresh_token
    )
    if (!refreshToken) {
      c.session.sendQuote(
        c.session.text('commands.bsbot.bind.bl.invalid-token')
      )
      return
    }
    token = refreshToken
    self = await c.services.api.BeatLeader.getTokenInfo(token.access_token)
    if (!self) {
      c.session.sendQuote(
        c.session.text('commands.bsbot.bind.bl.unknown-error')
      )
      return
    }
  }
  const now = new Date()
  const { blAccount } = await c.services.db.getUserAccountsByUid(c.session.user.id)
  const account: Partial<Account> = {
    userId: c.session.user.id,
    accountId: blAccount?.id ?? '',
    providerId: 'beatleader',
    providerUsername: self.name,
    metadata: {},
    accessToken: token.access_token,
    refreshToken: token.refresh_token,
    updatedAt: now,
    createdAt: now,
    type: 'oauth',
  }
  await c.services.db.addUserBindingInfo(account)
  c.session.sendQuote(
    c.session.text('commands.bsbot.bind.bl.success', {
      name: self.name,
      id: self.id,
    })
  )
}
