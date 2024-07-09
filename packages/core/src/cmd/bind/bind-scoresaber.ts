import { RelateAccount } from '@/db'
import { CmdContext } from '@/interface'

export const handleScoreSaberBind = async <T, C>(c: CmdContext<T, C>) => {
  const scoreSaberUser = await c.api.ScoreSaber.wrapperResult()
    .withRetry(3)
    .getScoreUserById(c.input)
  if (!scoreSaberUser.isSuccess()) {
    const text = c.session.text('commands.bsbot.bind.not-found', {
      id: c.input,
      platform: 'ScoreSaber',
    })
    c.session.sendQuote(text)
    return
  }
  const { ssAccount, blAccount } = await c.db.getUserAccountsByUid(
    c.session.u.id
  )
  const text =
    c.session.text('commands.bsbot.bind.ack-prompt', {
      user: `${scoreSaberUser.data.name}(${scoreSaberUser.data.id})`,
    }) +
    (ssAccount
      ? ',' +
        c.session.text('commands.bsbot.bind.exist', {
          id: ssAccount.platformUid,
        })
      : '')
  c.session.sendQuote(text)

  const prompt = await c.session.prompt(30000)
  if (!prompt || (prompt != 'y' && prompt != 'yes')) {
    c.session.sendQuote(
      c.session.text(
        prompt ? 'commands.bsbot.bind.cancel' : 'commands.bsbot.bind.timeout'
      )
    )
    return
  }
  const now = new Date()
  const account: Partial<RelateAccount> = {
    uid: c.session.u.id,
    platform: 'scoresaber',
    platformUid: scoreSaberUser.data.id,
    lastModifiedAt: now,
    lastRefreshAt: now,
    platformUname: scoreSaberUser.data.name,
    type: 'id',
  }
  if (!blAccount) {
    const account: Partial<RelateAccount> = {
      uid: c.session.u.id,
      platform: 'beatleader',
      platformUid: scoreSaberUser.data.id,
      lastModifiedAt: now,
      lastRefreshAt: now,
      platformUname: scoreSaberUser.data.name,
      type: 'id',
    }
    await c.db.addUserBindingInfo(account)
  }
  if (ssAccount) {
    account.id = ssAccount.id
  }
  await c.db.addUserBindingInfo(account)
  c.session.sendQuote(
    c.session.text('commands.bsbot.bind.success', {
      user: `${scoreSaberUser.data.name}(${scoreSaberUser.data.id})`,
    })
  )
}
