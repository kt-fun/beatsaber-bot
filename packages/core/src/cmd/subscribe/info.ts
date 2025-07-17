import {CmdContext, CommandBuilder} from "@/interface";
import { NoneSubscriptionError } from '@/services/errors'
import {groupTypes} from "@/cmd/subscribe/types";

export default () =>
  new CommandBuilder()
    .setName('subscribe-info')
    .addAlias('bbsubinfo')
    .addAlias('/subinfo')
    .setDescription('show subscriptions')
    .setExecutor(showSubscriptions)


export const showSubscriptions = async (c: CmdContext) => {
  const rows = await c.services.db.getSubscriptionInfoByUGID(
    c.session.channel.id,
    c.session.user.id
  )
  if (rows.length < 1) {
    throw new NoneSubscriptionError()
  }
  let text = c.session.text('commands.bsbot.subscription.info.header') + '\n'
  for (const row of rows) {
    if(groupTypes.includes(row.subscription.type)) {
      text += c.session.text('commands.bsbot.subscription-group.info.group-body-item', row.subscription.data) + '\n'
    }else {
      text += c.session.text('commands.bsbot.subscription.info.body-item', {
        type: row.subscription.type,
        cnt: row.memberCount,
        data: row.subscription.data,
        enabled: row.subscription.enabled,
      })
      if (row.me) {
        text += c.session.text(
          'commands.bsbot.subscribe.info.body-item-include-you'
        )
      }
      text += '\n'
    }
    text += '\n\n'
  }
  await c.session.sendQuote(text)
}
