
import {
  BSMapperSubscriptionNotExistError,
  SubscriptionNotExistError,
} from '@/services/errors'
import {CmdContext, CommandBuilder} from "@/interface";

export default () =>
  new CommandBuilder()
    .setName('unsubscribe')
    .addAlias('bbunsub')
    .addAlias('/unsubbl', { options: { type: 'beatleader' } })
    .addAlias('/unsubbs', { options: { type: 'beatsaver' } })
    .addAlias('unsubbl', { options: { type: 'beatleader' } })
    .addAlias('unsubbs', { options: { type: 'beatsaver' } })
    .addOption('type', 'type:string')
    .setDescription('')
    .setExecutor(async (c) => {
      const { blSub, bsMapSub, bsAlertSub } = await c.services.db.getSubscriptionsByGID(
        c.session.channel.id
      )
      if (c.options.type === 'beatleader') {
        if (!blSub) {
          throw new SubscriptionNotExistError('beatleader-score')
        }
        const data = { ...blSub, enable: false }
        await c.services.db.upsertSubscription(data)
        await c.session.sendQuote(
          c.session.text('commands.bsbot.unsubscribe.success.beatleader')
        )
      }

      if (c.options.type === 'beatsaver') {
        if (c.input) {
          await unsubIDBSMapper(c)
          return
        }

        if (!bsMapSub) {
          throw new SubscriptionNotExistError('beatsaver-map')
        }
        const data = { ...bsMapSub, enable: false }
        await c.services.db.upsertSubscription(data)
        c.session.sendQuote(
          c.session.text('commands.bsbot.unsubscribe.success.beatsaver')
        )
      }

      if (c.options.type === 'alert') {
        if (!bsAlertSub) {
          throw new SubscriptionNotExistError('beatsaver-alert')
        }
        const data = { ...bsAlertSub, enable: false }
        await c.services.db.upsertSubscription(data)
        await c.session.sendQuote(
          c.session.text('commands.bsbot.unsubscribe.success.alert')
        )
      }
    })

const unsubIDBSMapper = async (c: CmdContext) => {
  const input = c.input
  if (input) {
    const res = await c.services.db.getIDSubscriptionByChannelIDAndType(
      c.session.channel.id,
      'id-beatsaver-map'
    )
    const it = res.find((it) => it.data?.mapperId?.toString() === input)
    if (!it) {
      throw new BSMapperSubscriptionNotExistError({ id: input })
    }

    await c.services.db.removeIDSubscriptionByID(it.id)
    c.session.sendQuote(
      c.session.text('commands.bsbot.unsubscribe.success.beatsaver-mapper', {
        name: it?.data?.mapperName,
      })
    )
    return
  }
}

const unsubIDBLScore = async (c: CmdContext) => {
  const input = c.input
  if (input) {
    const res = await c.services.db.getIDSubscriptionByChannelIDAndType(
      c.session.channel.id,
      'id-beatleader-score'
    )
    const it = res.find((it) => it.data?.playerId?.toString() === input)
    if (!it) {
      throw new SubscriptionNotExistError(`id-beatleader-score(${input})`)
    }
    await c.services.db.removeIDSubscriptionByID(it.id)
    c.session.sendQuote(
      c.session.text('commands.bsbot.unsubscribe.success.beatleader-score', {
        name: it?.data?.playerId,
      })
    )
    return
  }
}
