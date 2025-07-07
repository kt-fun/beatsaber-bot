import { CmdContext } from '@/interface'
import { SubscriptionExistError } from '@/services/errors'

export const beatleader = async (c: CmdContext) => {
  const { blSub } = await c.services.db.getSubscriptionsByGID(c.session.channel.id)
  if (blSub) {
    if (blSub.enabled) {
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
    gid: c.session.channel.id,
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
