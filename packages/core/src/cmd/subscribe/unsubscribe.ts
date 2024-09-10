import { CommandBuilder } from '@/cmd/builder'
import { NoneSubscriptionExistError, SubscriptionNotExistError } from '@/errors'

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
      const { blSub, bsMapSub, bsAlertSub } = await c.db.getSubscriptionsByGID(
        c.session.g.id
      )
      if (c.options.type === 'beatleader') {
        if (!blSub) {
          throw new SubscriptionNotExistError('beatleader-score')
        }
        const data = { ...blSub, enable: false }
        await c.db.upsertSubscription(data)
        await c.session.sendQuote(
          c.session.text('commands.bsbot.unsubscribe.success.beatleader')
        )
      }

      if (c.options.type === 'beatsaver') {
        if (!bsMapSub) {
          throw new SubscriptionNotExistError('beatsaver-map')
        }
        const data = { ...bsMapSub, enable: false }
        await c.db.upsertSubscription(data)
        c.session.sendQuote(
          c.session.text('commands.bsbot.unsubscribe.success.beatsaver')
        )
      }

      if (c.options.type === 'alert') {
        if (!bsAlertSub) {
          throw new SubscriptionNotExistError('beatsaver-alert')
        }
        const data = { ...bsAlertSub, enable: false }
        await c.db.upsertSubscription(data)
        await c.session.sendQuote(
          c.session.text('commands.bsbot.unsubscribe.success.alert')
        )
      }
    })
