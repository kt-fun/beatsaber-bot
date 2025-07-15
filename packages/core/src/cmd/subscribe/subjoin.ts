import {CommandBuilder} from "@/interface";
import { SubscriptionNotExistError } from '@/services/errors'
export default () =>
  new CommandBuilder()
    .setName('subjoin')
    .addAlias('bbjoin')
    .addAlias('/joinbl', { options: { type: 'beatleader' } })
    .addAlias('/joinbs', { options: { type: 'beatsaver' } })
    .addAlias('bljoin', { options: { type: 'beatleader' } })
    .addAlias('bsjoin', { options: { type: 'beatsaver' } })
    .addOption('t', 'type:string')
    .setDescription('')
    .setExecutor(async (c) => {
      const { blSub, bsMapSub } = await c.services.db.getSubscriptionsByGID(
        c.session.channel.id
      )
      if (c.options.t === 'beatleader') {
        if (!blSub) {
          // create blSub?
          throw new SubscriptionNotExistError('beatleader-score')
        }
        const data = {
          subscriptionId: blSub.id,
          memberUid: c.session.user.id,
          joinedAt: new Date(),
        }
        await c.services.db.addSubscribeMember(data)
        await c.session.sendQuote(
          c.session.text('commands.bsbot.subscribe.join.success.beatleader')
        )
      } else if (c.options.t === 'beatsaver') {
        if (!bsMapSub) {
          throw new SubscriptionNotExistError('beatsaver-map')
        }
        const data = {
          subscriptionId: bsMapSub.id,
          memberUid: c.session.user.id,
          joinedAt: new Date(),
        }
        await c.services.db.addSubscribeMember(data)
        c.session.sendQuote(
          c.session.text('commands.bsbot.subscribe.join.success.beatsaver')
        )
      }
    })
