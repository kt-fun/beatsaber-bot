
import {
  InvalidParamsError, MissingParamsError,
  SubscriptionNotExistError,
} from '@/services/errors'
import {CmdContext, CommandBuilder} from "@/interface";
import {groupTypes, idTypes, supportTypes} from "./types";



export default () =>
  new CommandBuilder()
    .setName('unsubscribe')
    .addAlias('bbunsub')
    .addAlias('/unsubbl', { options: { type: 'blscore' } })
    .addAlias('/unsubbs', { options: { type: 'bsmap' } })
    .addAlias('unsubbl', { options: { type: 'blscore' } })
    .addAlias('unsubbs', { options: { type: 'bsmap' } })
    .addOption('t', 'type:string')
    .setDescription('remove subscription')
    .setExecutor(async (c) => {
      const t = c.options.t
      if(!supportTypes.includes(t)) throw new InvalidParamsError({
        name: "type",
        expect: supportTypes.toString(),
        actual: t
      })
      if(!groupTypes.includes(t)) {
        return unsubscribeId(c)
      }
      const subscription = await c.services.db
        .getGroupSubscriptionByChannelIDAndType(c.session.channel.id, t)
      if(!subscription) throw new SubscriptionNotExistError({ type: c.options.t, channelId: c.session.channel.id })
      const data = { ...subscription, enabled: false }
      await c.services.db.upsertSubscription(data)
      await c.session.sendQuote(c.session.text(`commands.bsbot.unsubscribe.success.${t}`))
  })


const getIdByType = (c: CmdContext<{t?: string}>) => {
  const t = c.options.t
  switch (t) {
    case 'bsmap':
    case 'blscore':
      if(!c.input) throw new MissingParamsError({ name: "accountId", example: "58338" })
      return `${t}::${c.session.channel.id}::${c.input}`
    case 'lbrank': return `${t}::${c.session.channel.id}`
  }
  throw new InvalidParamsError({
    name: "type",
    expect: idTypes.toString(),
    actual: t
  })
}

const unsubscribeId = async (c: CmdContext<{t?: string}>) => {
  const id = getIdByType(c)
  const subscription = await c.services.db.getSubscriptionByID(id)
  if (!subscription) {
    throw new SubscriptionNotExistError({ type: c.options.t, channelId: c.session.channel.id, id: id })
  }
  await c.services.db.removeSubscriptionByID(id)
  await c.session.sendQuote(
    c.session.text(`commands.bsbot.unsubscribe.success.${c.options.t}`, subscription.data)
  )
}
