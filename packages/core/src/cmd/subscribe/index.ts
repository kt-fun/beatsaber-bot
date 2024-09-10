import { CommandBuilder } from '@/cmd/builder'
import { beatleader } from '@/cmd/subscribe/beatleader'
import { beatsaver } from '@/cmd/subscribe/beatsaver'
import { NoneSubscriptionExistError } from '@/errors'

export default () =>
  new CommandBuilder()
    .setName('subscribe')
    .addAlias('bbsub')
    .addAlias('/subbl', { options: { type: 'beatleader' } })
    .addAlias('/subbs', { options: { type: 'beatsaver' } })
    .addAlias('blsub', { options: { type: 'beatleader' } })
    .addAlias('bssub', { options: { type: 'beatsaver' } })
    .addOption('type', 'type:string')
    .setDescription('clear an auth account relate info')
    .setExecutor(async (c) => {
      // check admin permission
      // if (options.type === 'beatsaver-alert') {
      //   return alert(c)
      // }

      if (c.options.type === 'beatsaver') {
        return beatsaver(c)
      }

      if (c.options.type === 'beatleader') {
        return beatleader(c)
      }

      // return subscription info
      const rows = await c.db.getSubscriptionInfoByUGID(
        c.session.g.id,
        c.session.u.id
      )

      if (rows.length < 1) {
        throw new NoneSubscriptionExistError()
      }
      let text = c.session.text('commands.bsbot.subscribe.info.header') + '\n'
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
      await c.session.sendQuote(text)
    })
