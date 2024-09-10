import { CmdContext } from '@/interface'
import { SubscriptionExistError } from '@/errors'
export const beatsaver = async <T, C>(c: CmdContext<T, C>) => {
  const { bsMapSub } = await c.db.getSubscriptionsByGID(c.session.g.id)
  if (bsMapSub) {
    if (bsMapSub.enable) {
      throw new SubscriptionExistError()
    }
    const data = { ...bsMapSub, enable: true }
    await c.db.upsertSubscription(data)
    await c.session.sendQuote(
      c.session.text('commands.bsbot.subscribe.beatsaver.success')
    )
    return
  }
  const data = {
    gid: c.session.g.id,
    type: 'beatsaver-map',
    time: new Date(),
    enable: true,
    data: {},
  }
  await c.db.upsertSubscription(data)
  await c.session.sendQuote(
    c.session.text('commands.bsbot.subscribe.beatsaver.success')
  )
}
