import { CommandBuilder } from '@/cmd/builder'

export default () =>
  new CommandBuilder()
    .setName('subleave')
    .addAlias('bbleave')
    .addAlias('/leavebl', { options: { type: 'beatleader' } })
    .addAlias('/leavebs', { options: { type: 'beatsaver' } })
    .addAlias('leavebl', { options: { type: 'beatleader' } })
    .addAlias('leavebs', { options: { type: 'beatsaver' } })
    .addOption('type', 'type:string')
    .setDescription('')
    .setExecutor(async (c) => {
      // getUserJoinedGroupMember
      const subs = await c.db.getSubscriptionInfoByUGID(
        c.session.g.id,
        c.session.u.id
      )
      if (c.options.type === 'beatleader') {
        const blSub = subs.find((it) => it.subscribe.type == 'beatleader-score')
        if (!blSub?.me) {
          c.session.sendQuote(
            c.session.text(
              'commands.bsbot.subscribe.leave.not-exist.beatleader'
            )
          )
          return
        }
        await c.db.removeFromSubGroupBySubAndUid(
          blSub.subscribe.id,
          c.session.u.id
        )
        c.session.sendQuote(
          c.session.text('commands.bsbot.subscribe.leave.success.beatleader')
        )
      } else if (c.options.type === 'beatsaver') {
        const bsSub = subs.find((it) => it.subscribe.type == 'beatsaver-map')
        if (!bsSub?.me) {
          await c.session.sendQuote(
            c.session.text('commands.bsbot.subscribe.leave.not-exist.beatsaver')
          )
          return
        }

        await c.db.removeFromSubGroupBySubAndUid(
          bsSub.subscribe.id,
          c.session.u.id
        )
        await c.session.sendQuote(
          c.session.text('commands.bsbot.subscribe.leave.success.beatsaver')
        )
      }
    })
