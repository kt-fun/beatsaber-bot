import {CommandBuilder} from "@/interface";
import { beatleader } from './beatleader'
import { beatsaver } from './beatsaver'
import { NoneSubscriptionExistError } from '@/services/errors'
import { idBeatsaverMapper } from './id-beatsaver-mapper'

export default () =>
  new CommandBuilder()
    .setName('subscribe')
    .addAlias('bbsub')
    .addAlias('/subbl', { options: { type: 'beatleader' } })
    .addAlias('/subbs', { options: { type: 'beatsaver' } })
    .addAlias('blsub', { options: { type: 'beatleader' } })
    .addAlias('bssub', { options: { type: 'beatsaver' } })
    .addAlias('subbl', { options: { type: 'beatleader' } })
    .addAlias('subbs', { options: { type: 'beatsaver' } })
    .addAlias('subbl', { options: { type: 'beatleader' } })
    .addAlias('submapper', { options: { type: 'bsmapper' } })
    .addOption('t', 'type:string')
    .setDescription('clear an auth account relate info')
    .setExecutor(async (c) => {
      // check admin permission
      // if (options.type === 'beatsaver-alert') {
      //   return alert(c)
      // }

      if (c.options.t === 'beatsaver') {
        if (c.input) return idBeatsaverMapper(c)
        return beatsaver(c)
      }

      if (c.options.t === 'beatleader') {
        return beatleader(c)
      }

      // return subscription info
      const rows = await c.services.db.getSubscriptionInfoByUGID(
        c.session.channel.id,
        c.session.user.id
      )

      if (rows.length < 1) {
        throw new NoneSubscriptionExistError()
      }
      let text = c.session.text('commands.bsbot.subscribe.info.header') + '\n'
      for (const row of rows) {
        if (row.subscription.type.startsWith('group')) {
          text += c.session.text(
            'commands.bsbot.subscribe.info.group-body-item',
            {
              type:
                row.subscription.type +
                `(${row.subscription.data?.mapperName} ${row.subscription.data?.mapperId})`,
            }
          )
        } else {
          text += c.session.text('commands.bsbot.subscribe.info.body-item', {
            type: row.subscription.type,
            cnt: row.memberCount,
            enable: row.subscription.enabled,
          })
          if (row.me) {
            text += c.session.text(
              'commands.bsbot.subscribe.info.body-item-include-you'
            )
          }
        }

        text += '\n\n'
      }
      await c.session.sendQuote(text)
    })
