import { CmdContext } from '@/interface'
import { BLIDNotFoundError, SubscriptionExistError } from '@/services/errors'

export const idBeatleaderScore = async (c: CmdContext) => {
  if (!c.input) {
    return
  }
  const bluser = await c.services.api.BeatLeader.getPlayerInfo(c.input)
  if (!bluser) {
    throw new BLIDNotFoundError({ accountId: c.input })
  }

  const subscribes = await c.services.db.getIDSubscriptionByChannelIDAndType(
    c.session.channel.id,
    'id-beatleader-score'
  )
  const it = subscribes.find((it) => it.data?.playerId === bluser.id)
  if (it) {
    if (it.enabled) {
      throw new SubscriptionExistError()
    }

    const data = { ...it, enable: true }
    await c.services.db.upsertSubscription(data)
    await c.session.sendQuote(
      c.session.text('commands.bsbot.subscribe.beatsaver-mapper.success', {
        name: bluser.name,
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
      playerId: bluser.id,
    },
  }
  await c.services.db.upsertSubscription(data)
  await c.session.sendQuote(
    c.session.text('commands.bsbot.subscribe.beatsaver-mapper.success', {
      name: bluser.name,
    })
  )
}
