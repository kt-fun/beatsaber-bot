import { CmdContext } from '@/interface'
import { BLIDNotFoundError, SubscriptionExistError } from '@/errors'

export const idBeatleaderScore = async <T, C>(c: CmdContext<T, C>) => {
  if (!c.input) {
    return
  }
  const bluser = await c.api.BeatLeader.getPlayerInfoById(c.input)
  if (!bluser) {
    throw new BLIDNotFoundError({ accountId: c.input })
  }

  const subscribes = await c.db.getIDSubscriptionByGIDAndType(
    c.session.g.id,
    'id-beatleader-score'
  )
  const it = subscribes.find((it) => it.data?.playerId === bluser.id)
  if (it) {
    if (it.enable) {
      throw new SubscriptionExistError()
    }

    const data = { ...it, enable: true }
    await c.db.upsertSubscription(data)
    await c.session.sendQuote(
      c.session.text('commands.bsbot.subscribe.beatsaver-mapper.success', {
        name: bluser.name,
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
      playerId: bluser.id,
    },
  }
  await c.db.upsertSubscription(data)
  await c.session.sendQuote(
    c.session.text('commands.bsbot.subscribe.beatsaver-mapper.success', {
      name: bluser.name,
    })
  )
}
