import { CmdContext } from '@/interface'
import { BSIDNotFoundError, SubscriptionExistError } from '@/errors'
export const idBeatsaverMapper = async <T, C>(c: CmdContext<T, C>) => {
  if (!c.input) {
    return
  }
  const mapper = await c.api.BeatSaver.getBSMapperById(c.input)
  if (!mapper) {
    throw new BSIDNotFoundError({ accountId: c.input })
  }

  const subscribes = await c.db.getIDSubscriptionByGIDAndType(
    c.session.g.id,
    'id-beatsaver-map'
  )
  const it = subscribes.find((it) => it.data?.mapperId === mapper.id)
  if (it) {
    if (it.enable) {
      throw new SubscriptionExistError()
    }

    const data = { ...it, enable: true }
    await c.db.upsertSubscription(data)
    await c.session.sendQuote(
      c.session.text('commands.bsbot.subscribe.beatsaver-mapper.success', {
        name: mapper.name,
      })
    )
    return
  }
  const data = {
    gid: c.session.g.id,
    type: 'id-beatsaver-map',
    time: new Date(),
    enable: true,
    data: {
      mapperId: mapper.id,
      mapperName: mapper.name,
    },
  }
  await c.db.upsertSubscription(data)
  await c.session.sendQuote(
    c.session.text('commands.bsbot.subscribe.beatsaver-mapper.success', {
      name: mapper.name,
    })
  )
}
