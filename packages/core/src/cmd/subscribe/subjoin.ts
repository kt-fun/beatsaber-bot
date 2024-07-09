import { CommandBuilder } from '@/cmd/builder'
export default () =>
  new CommandBuilder()
    .setName('subjoin')
    .addAlias('bbjoin')
    .addOption('type', '<type:string>')
    .setDescription('clear an auth account relate info')
    .setExecutor(async (c) => {
      const { blSub, bsMapSub } = await c.db.getSubscriptionsByGID(
        c.session.g.id
      )
      if (c.options.type === 'beatleader') {
        if (!blSub) {
          c.session.sendQuote(
            c.session.text('commands.bsbot.subscribe.join.nosub.beatleader')
          )
          return
        }
        const data = {
          subscribeId: blSub.id,
          memberUid: c.session.u.id,
          joinedAt: new Date(),
        }
        await c.db.addSubscribeMember(data)
        c.session.sendQuote(
          c.session.text('commands.bsbot.subscribe.join.success.beatleader')
        )
      } else if (c.options.type === 'beatsaver') {
        if (!bsMapSub) {
          c.session.sendQuote(
            c.session.text('commands.bsbot.subscribe.join.nosub.beatsaver')
          )
          return
        }
        const data = {
          subscribeId: bsMapSub.id,
          memberUid: c.session.u.id,
          joinedAt: new Date(),
        }
        await c.db.addSubscribeMember(data)
        c.session.sendQuote(
          c.session.text('commands.bsbot.subscribe.join.success.beatsaver')
        )
      }
    })
