import { CmdContext } from '@/interface'
import { SubscriptionExistError } from '@/services/errors'
export const beatsaver = async (c: CmdContext) => {
  const { bsMapSub } = await c.services.db.getSubscriptionsByGID(c.session.channel.id)
  if (bsMapSub) {
    if (bsMapSub.enabled) {
      throw new SubscriptionExistError()
    }
    const data = { ...bsMapSub, enable: true }
    await c.services.db.upsertSubscription(data)
    await c.session.sendQuote(
      c.session.text('commands.bsbot.subscribe.beatsaver.success')
    )
    return
  }
  const data = {
    gid: c.session.channel.id,
    type: 'beatsaver-map',
    time: new Date(),
    enable: true,
    data: {},
  }
  await c.services.db.upsertSubscription(data)
  await c.session.sendQuote(
    c.session.text('commands.bsbot.subscribe.beatsaver.success')
  )
}
