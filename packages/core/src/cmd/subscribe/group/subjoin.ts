import {CommandBuilder} from "@/interface";
import {InvalidParamsError, SubscriptionNotExistError} from '@/services/errors'
import {groupTypes} from "../types";



export default () =>
  new CommandBuilder()
    .setName('join-subscription-group')
    .addAlias('bbjoin')
    .addAlias('/joinbl', { options: { type: 'blscore-group' } })
    .addAlias('/joinbs', { options: { type: 'bsmap-group' } })
    .addAlias('bljoin', { options: { type: 'blscore-group' } })
    .addAlias('bsjoin', { options: { type: 'bsmap-group' } })
    .addOption('t', 'type:string')
    .setDescription('join subscription group')
    .setExecutor(async (c) => {
      const t = c.options.t
      if(!groupTypes.includes(t)) throw new InvalidParamsError({
        name: "type",
        expect: groupTypes.toString(),
        actual: t
      })
      const subscription = await c.services.db
        .getChannelSubscriptionByChannelIDAndType(c.session.channel.id, t)
      if (!subscription) throw new SubscriptionNotExistError({ type: t, channelId: c.session.channel.id })
      const data = {
        subscriptionId: subscription?.id,
        memberId: c.session.user.id,
      }
      await c.services.db.addSubscribeMember(data)
      await c.session.sendQuote(c.session.text(`commands.bsbot.join-subscription-group.success.${t}`))
    })
