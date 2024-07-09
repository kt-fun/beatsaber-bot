import { CmdContext } from '@/interface'

export const beatleader = async <T, C>(c: CmdContext<T, C>) => {
  const { blSub } = await c.db.getSubscriptionsByGID(c.session.g.id)
  if (blSub) {
    if (blSub.enable) {
      c.session.sendQuote(
        c.session.text('commands.bsbot.subscribe.beatleader.exist')
      )
      return
    }
    const data = { ...blSub, enable: true }
    await c.db.upsertSubscription(data)
    c.session.sendQuote(
      c.session.text('commands.bsbot.subscribe.beatleader.success')
    )
    return
  }

  const data = {
    gid: c.session.g.id,
    type: 'beatleader-score',
    time: new Date(),
    enable: true,
    data: {},
  }
  await c.db.upsertSubscription(data)
  c.session.sendQuote(
    c.session.text('commands.bsbot.subscribe.beatleader.success')
  )
}
