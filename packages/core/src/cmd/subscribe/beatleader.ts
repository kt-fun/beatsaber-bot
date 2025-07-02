import { CmdContext } from '@/interface'
import { SubscriptionExistError } from '@/infra/errors'

export const beatleader = async <T, C>(c: CmdContext<T, C>) => {
  const { blSub } = await c.services.db.getSubscriptionsByGID(c.session.g.id)
  if (blSub) {
    if (blSub.enable) {
      throw new SubscriptionExistError()
    }
    const data = { ...blSub, enable: true }
    await c.services.db.upsertSubscription(data)
    await c.session.sendQuote(
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
  await c.services.db.upsertSubscription(data)
  await c.session.sendQuote(
    c.session.text('commands.bsbot.subscribe.beatleader.success')
  )
}
