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
    .addOption('type', 'type:string')
    .setDescription('')
    .setExecutor(async (c) => {
      const { blSub, bsMapSub } = await c.services.db.getSubscriptionsByGID(
        c.session.channel.id
      )
      if (c.options.type === 'beatleader') {
        if (!blSub) {
          // create blSub?
          throw new SubscriptionNotExistError('beatleader-score')
        }
        const data = {
          subscribeId: blSub.id,
          memberUid: c.session.user.id,
          joinedAt: new Date(),
        }
        await c.services.db.addSubscribeMember(data)
        await c.session.sendQuote(
          c.session.text('commands.bsbot.subscribe.join.success.beatleader')
        )
      } else if (c.options.type === 'beatsaver') {
        if (!bsMapSub) {
          throw new SubscriptionNotExistError('beatsaver-map')
        }
        const data = {
          subscribeId: bsMapSub.id,
          memberUid: c.session.user.id,
          joinedAt: new Date(),
        }
        await c.services.db.addSubscribeMember(data)
        c.session.sendQuote(
          c.session.text('commands.bsbot.subscribe.join.success.beatsaver')
        )
      }
    })
