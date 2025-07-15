import {CommandBuilder} from "@/interface";

export default () =>
  new CommandBuilder()
    .setName('subleave')
    .addAlias('bbleave')
    .addAlias('/leavebl', { options: { type: 'beatleader' } })
    .addAlias('/leavebs', { options: { type: 'beatsaver' } })
    .addAlias('leavebl', { options: { type: 'beatleader' } })
    .addAlias('leavebs', { options: { type: 'beatsaver' } })
    .addOption('t', 'type:string')
    .setDescription('')
    .setExecutor(async (c) => {
      // getUserJoinedGroupMember
      const subs = await c.services.db.getSubscriptionInfoByUGID(
        c.session.channel.id,
        c.session.user.id
      )
      if (c.options.t === 'beatleader') {
        const blSub = subs.find((it) => it.subscription.type == 'beatleader-score')
        if (!blSub?.me) {
          return c.session.sendQuote(
            c.session.text(
              'commands.bsbot.subscribe.leave.not-exist.beatleader'
            )
          )
        }
        await c.services.db.removeFromSubGroupBySubAndUid(
          blSub.subscription.id,
          c.session.user.id
        )
        await c.session.sendQuote(
          c.session.text('commands.bsbot.subscribe.leave.success.beatleader')
        )
      } else if (c.options.t === 'beatsaver') {
        const bsSub = subs.find((it) => it.subscription.type == 'beatsaver-map')
        if (!bsSub?.me) {
          await c.session.sendQuote(
            c.session.text('commands.bsbot.subscribe.leave.not-exist.beatsaver')
          )
          return
        }

        await c.services.db.removeFromSubGroupBySubAndUid(
          bsSub.subscription.id,
          c.session.user.id
        )
        await c.session.sendQuote(
          c.session.text('commands.bsbot.subscribe.leave.success.beatsaver')
        )
      }
    })
