import {CommandBuilder} from "@/interface";
import {InvalidParamsError, SubscriptionNotExistError} from "@/services/errors";
import {groupTypes} from "../types";

export const Subleave =
  new CommandBuilder()
    .setName('leave-subscription-group')
    .addAlias('bbleave')
    .addAlias('/leavebl', { options: { type: 'blscore-group' } })
    .addAlias('/leavebs', { options: { type: 'bsmap-group' } })
    .addAlias('leavebl', { options: { type: 'blscore-group' } })
    .addAlias('leavebs', { options: { type: 'bsmap-group' } })
    .addOption('t', 'type:string')
    .setDescription('leave subscription group')
    .setExecutor(async (c) => {
      const t = c.options.t
      if(!groupTypes.includes(t)) throw new InvalidParamsError({
        name: "type",
        expect: groupTypes.toString(),
        actual: t
      })
      const subscription = await c.services.db.getSubscriptionMemberByUserChannelAndType(
        c.session.user.id,
        c.session.channel.id,
        t
      )
      if(!subscription) throw new SubscriptionNotExistError({ type: t, channelId: c.session.channel.id })
      if (!subscription.me) {
        return c.session.sendQuote(
          c.session.text(
            `commands.bsbot.leave-subscription-group.not-member.${t}`
          )
        )
      }
      await c.services.db.removeSubscriptionMemberBySubIdAndMemberId(
        subscription.subscription.id,
        c.session.user.id
      )
      await c.session.sendQuote(
        c.session.text(`commands.bsbot.leave-subscription-group.success.${t}`)
      )
    })
