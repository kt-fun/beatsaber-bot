import { CommandBuilder } from '@/cmd/builder'

export default () =>
  new CommandBuilder()
    .setName('unsubscribe')
    .addAlias('bbunsub')
    .addOption('type', '<type:string>')
    .setDescription('clear an auth account relate info')
    .setExecutor(async (c) => {
      const { blSub, bsMapSub, bsAlertSub } = await c.db.getSubscriptionsByGID(
        c.session.g.id
      )
      if (c.options.type === 'beatleader') {
        if (!blSub) {
          c.session.sendQuote(
            c.session.text('commands.bsbot.unsubscribe.nosub.beatleader')
          )
          return
        }
        const data = { ...blSub, enable: false }
        await c.db.upsertSubscription(data)
        c.session.sendQuote(
          c.session.text('commands.bsbot.unsubscribe.success.beatleader')
        )
      } else if (c.options.type === 'beatsaver') {
        if (!bsMapSub) {
          c.session.sendQuote(
            c.session.text('commands.bsbot.unsubscribe.nosub.beatsaver')
          )
          return
        }
        const data = { ...bsMapSub, enable: false }
        await c.db.upsertSubscription(data)
        c.session.sendQuote(
          c.session.text('commands.bsbot.unsubscribe.success.beatsaver')
        )
      } else if (c.options.type === 'alert') {
        if (!bsAlertSub) {
          c.session.sendQuote(
            c.session.text('commands.bsbot.unsubscribe.nosub.alert')
          )
          return
        }
        const data = { ...bsAlertSub, enable: false }
        await c.db.upsertSubscription(data)
        c.session.sendQuote(
          c.session.text('commands.bsbot.unsubscribe.success.alert')
        )
      }
    })
