import { CmdContext } from '@/interface'
import { BSIDNotFoundError, SubscriptionExistError } from '@/services/errors'
export const idBeatsaverMapper = async (c: CmdContext) => {
  if (!c.input) {
    return
  }
  const mapper = await c.services.api.BeatSaver.getBSMapperById(c.input)
  if (!mapper) {
    throw new BSIDNotFoundError({ accountId: c.input })
  }
  const subscribes = await c.services.db.getIDSubscriptionByChannelIDAndType(
    c.session.channel.id,
    'id-beatsaver-map'
  )
  const it = subscribes.find((it) => it.data?.mapperId === mapper.id)
  if (it) {
    if (it.enabled) {
      throw new SubscriptionExistError()
    }

    const data = { ...it, enable: true }
    await c.services.db.upsertSubscription(data)
    await c.session.sendQuote(
      c.session.text('commands.bsbot.subscribe.beatsaver-mapper.success', {
        name: mapper.name,
      })
    )
    return
  }
  const data = {
    gid: c.session.channel.id,
    type: 'id-beatsaver-map',
    time: new Date(),
    enable: true,
    data: {
      mapperId: mapper.id,
      mapperName: mapper.name,
    },
  }
  await c.services.db.upsertSubscription(data)
  await c.session.sendQuote(
    c.session.text('commands.bsbot.subscribe.beatsaver-mapper.success', {
      name: mapper.name,
    })
  )
}
