import {Account, CmdContext} from '@/interface'
import {
  SessionPromotionCancelError,
  SessionPromotionTimeoutError,
  SSIDNotFoundError,
} from '@/services/errors'

export const handleScoreSaberBind = async (c: CmdContext) => {
  const scoreSaberUser = await c.services.api.ScoreSaber.getScoreUserById(c.input)
  if (!scoreSaberUser) {
    throw new SSIDNotFoundError({accountId: c.input})
  }
  const {ssAccount} = await c.services.db.getUserAccountsByUid(c.session.user.id)
  const text =
    c.session.text('commands.bsbot.bind.ack-prompt', {
      user: `${scoreSaberUser.name}(${scoreSaberUser.id})`,
    }) +
    (ssAccount ? ',' + c.session.text('commands.bsbot.bind.exist', {id: ssAccount.accountId,}) : '')

  await c.session.sendQuote(text)

  const prompt = await c.session.prompt(30000)
  if (!prompt || (prompt != 'y' && prompt != 'yes')) {
    throw prompt
      ? new SessionPromotionCancelError()
      : new SessionPromotionTimeoutError()
  }
  const now = new Date()
  const account: Partial<Account> = {
    userId: c.session.user.id,
    accountId: scoreSaberUser.id,
    providerId: 'scoresaber',
    providerUsername: scoreSaberUser.name,
    lastModifiedAt: now,
    lastRefreshAt: now,
    createdAt: now,
    type: 'id',
  }
  await c.services.db.addUserBindingInfo(account)
  await c.session.sendQuote(
    c.session.text('commands.bsbot.bind.success', {
      user: `${scoreSaberUser.name}(${scoreSaberUser.id})`,
    })
  )
}
