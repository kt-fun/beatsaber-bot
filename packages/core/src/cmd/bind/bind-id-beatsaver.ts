import { CmdContext, Account } from '@/interface'

import {
  BSIDNotFoundError,
  SessionPromotionCancelError,
  SessionPromotionTimeoutError,
} from '@/services/errors'

export const handleBeatSaverIDBind = async (c: CmdContext) => {
  const mapper = await c.services.api.BeatSaver.getBSMapperById(c.input)
  if (!mapper) {
    throw new BSIDNotFoundError({ accountId: c.input })
  }
  // 如果当前bind 是 oauth？改为 id？
  const now = new Date()
  const { bsAccount } = await c.services.db.getUserAccountsByUid(c.session.user.id)

  const text =
    c.session.text('commands.bsbot.bind.ack-prompt', {
      user: `${mapper.name}(${mapper.id})`,
    }) +
    (bsAccount
      ? ',' +
        c.session.text('commands.bsbot.bind.exist', {
          id: bsAccount.accountId,
        })
      : '')

  await c.session.sendQuote(text)

  const prompt = await c.session.prompt(30000)
  if (!prompt || (prompt != 'y' && prompt != 'yes')) {
    throw prompt
      ? new SessionPromotionCancelError()
      : new SessionPromotionTimeoutError()
  }
  const account: Partial<Account> = {
    userId: c.session.user.id,
    providerId: 'beatsaver',
    accountId: mapper.id.toString(),
    providerUsername: mapper.name,
    metadata: {},
    lastModifiedAt: now,
    lastRefreshAt: now,
    type: 'id',
  }
  await c.services.db.addUserBindingInfo(account)
  c.session.sendQuote(
    c.session.text('commands.bsbot.bind.bs.success', {
      name: mapper.name,
      id: mapper.id,
    })
  )
}
