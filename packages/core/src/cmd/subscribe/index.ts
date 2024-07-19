import { CommandBuilder } from '@/cmd/builder'
import { beatleader } from '@/cmd/subscribe/beatleader'
import { beatsaver } from '@/cmd/subscribe/beatsaver'

export default () =>
  new CommandBuilder()
    .setName('subscribe')
    .addAlias('bbsub')
    .addAlias('/subbl', { type: 'beatleader' })
    .addAlias('/subbs', { type: 'beatsaver' })
    .addOption('type', '<type:string>')
    .setDescription('clear an auth account relate info')
    .setExecutor(async (c) => {
      // check admin permission
      // if (options.type === 'beatsaver-alert') {
      //   return alert(ctx, api, { session, options }, input, logger)
      // }

      if (c.options.type === 'beatsaver') {
        return beatsaver(c)
      }

      if (c.options.type === 'beatleader') {
        return beatleader(c)
      }
      const rows = await c.db.getSubscriptionInfoByUGID(
        c.session.g.id,
        c.session.u.id
      )

      if (rows.length < 1) {
        c.session.sendQuote(
          c.session.text('commands.bsbot.subscribe.info.none')
        )
        return
      }
      let text = c.session.text('commands.bsbot.subscribe.info.header')
      for (const row of rows) {
        text += c.session.text('commands.bsbot.subscribe.info.body-item', {
          type: row.subscribe.type,
          cnt: row.memberCount,
        })
        if (row.me) {
          text += c.session.text(
            'commands.bsbot.subscribe.info.body-item-include-you'
          )
        }
        text += '\n\n'
      }
      c.session.sendQuote(text)
    })
