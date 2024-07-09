import { CmdContext } from '@/interface'
export const beatsaver = async <T, C>(c: CmdContext<T, C>) => {
  const { bsMapSub } = await c.db.getSubscriptionsByGID(c.session.g.id)
  if (bsMapSub) {
    if (bsMapSub.enable) {
      c.session.sendQuote(
        c.session.text('commands.bsbot.subscribe.beatsaver.exist')
      )
      return
    }
    const data = { ...bsMapSub, enable: true }
    await c.db.upsertSubscription(data)
    c.session.sendQuote(
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
  c.session.sendQuote(
    c.session.text('commands.bsbot.subscribe.beatsaver.success')
  )
}
