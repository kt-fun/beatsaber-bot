import { RelateAccount, CmdContext } from '@/interface'
import {
  ScoreSaberIDNotFoundError,
  SessionPromotionCancelError,
  SessionPromotionTimeoutError,
} from '@/errors'

export const handleScoreSaberBind = async <T, C>(c: CmdContext<T, C>) => {
  const scoreSaberUser = await c.api.ScoreSaber.getScoreUserById(c.input)

  if (!scoreSaberUser) {
    throw new ScoreSaberIDNotFoundError(c.input)
  }

  const { ssAccount, blAccount } = await c.db.getUserAccountsByUid(
    c.session.u.id
  )
  const text =
    c.session.text('commands.bsbot.bind.ack-prompt', {
      user: `${scoreSaberUser.name}(${scoreSaberUser.id})`,
    }) +
    (ssAccount
      ? ',' +
        c.session.text('commands.bsbot.bind.exist', {
          id: ssAccount.platformUid,
        })
      : '')

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
  // if (!blAccount) {
  //   const account: Partial<RelateAccount> = {
  //     uid: c.session.u.id,
  //     platform: 'beatleader',
  //     platformUid: scoreSaberUser.data.id,
  //     lastModifiedAt: now,
  //     lastRefreshAt: now,
  //     platformUname: scoreSaberUser.data.name,
  //     type: 'id',
  //   }
  //   await c.db.addUserBindingInfo(account)
  // }
  if (ssAccount) {
    account.id = ssAccount.id
  }
  await c.db.addUserBindingInfo(account)
  c.session.sendQuote(
    c.session.text('commands.bsbot.bind.success', {
      user: `${scoreSaberUser.name}(${scoreSaberUser.id})`,
    })
  )
}
