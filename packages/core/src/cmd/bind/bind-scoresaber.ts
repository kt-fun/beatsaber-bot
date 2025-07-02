import {RelateAccount, CmdContext} from '@/interface'
import {
  SessionPromotionCancelError,
  SessionPromotionTimeoutError,
  SSIDNotFoundError,
} from '@/infra/errors'

export const handleScoreSaberBind = async <T, C>(c: CmdContext<T, C>) => {
  const scoreSaberUser = await c.services.api.ScoreSaber.getScoreUserById(c.input)
  if (!scoreSaberUser) {
    throw new SSIDNotFoundError({accountId: c.input})
  }
  const {ssAccount, blAccount} = await c.services.db.getUserAccountsByUid(
    c.session.u.id
  )
  const text =
    c.session.text('commands.bsbot.bind.ack-prompt', {
      user: `${scoreSaberUser.name}(${scoreSaberUser.id})`,
    }) +
    (ssAccount ? ',' + c.session.text('commands.bsbot.bind.exist', {id: ssAccount.platformUid,}) : '')

  await c.session.sendQuote(text)

  const prompt = await c.session.prompt(30000)
  if (!prompt || (prompt != 'y' && prompt != 'yes')) {
    throw prompt
      ? new SessionPromotionCancelError()
      : new SessionPromotionTimeoutError()
  }
  const now = new Date()
  const account: Partial<RelateAccount> = {
    uid: c.session.u.id,
    platform: 'scoresaber',
    platformUid: scoreSaberUser.id,
    lastModifiedAt: now,
    lastRefreshAt: now,
    platformUname: scoreSaberUser.name,
    type: 'id',
    status: 'ok',
  }
  if (ssAccount) {
    account.id = ssAccount.id
  }
  await c.services.db.addUserBindingInfo(account)
  c.session.sendQuote(
    c.session.text('commands.bsbot.bind.success', {
      user: `${scoreSaberUser.name}(${scoreSaberUser.id})`,
    })
  )
}
