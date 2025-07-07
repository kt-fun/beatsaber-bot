import { CmdContext, Account } from '@/interface'
import {
  BLIDNotFoundError,
  SessionPromotionCancelError,
  SessionPromotionTimeoutError,
} from '@/services/errors'

export const handleBeatLeaderIDBind = async (c: CmdContext) => {
  const player = await c.services.api.BeatLeader.getPlayerInfo(c.input)
  if (!player) {
    throw new BLIDNotFoundError({ accountId: c.input })
  }

  const now = new Date()
  const { blAccount } = await c.services.db.getUserAccountsByUid(c.session.user.id)

  const text =
    c.session.text('commands.bsbot.bind.ack-prompt', {
      user: `${player.name}(${player.id})`,
    }) +
    (blAccount
      ? ',' +
        c.session.text('commands.bsbot.bind.exist', {
          id: blAccount.accountId,
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
    providerId: 'beatleader',
    accountId: player.id.toString(),
    providerUsername: player.name,
    metadata: {},
    lastModifiedAt: now,
    lastRefreshAt: now,
    createdAt: now,
    type: 'id',
  }
  await c.services.db.addUserBindingInfo(account)
  await c.session.sendQuote(
    c.session.text('commands.bsbot.bind.bl.success', {
      name: player.name,
      id: player.id,
    })
  )
}
