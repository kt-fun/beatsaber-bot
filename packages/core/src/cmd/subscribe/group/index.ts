import {CmdContext} from "@/interface";
import {groupTypes, supportTypes} from "@/cmd/subscribe/types";
import {InvalidParamsError} from "@/services/errors";


export const subscribeGroup = async (c: CmdContext<{t?: string}>) => {
  const t = c.options.t
  if(!groupTypes.includes(t)) throw new InvalidParamsError({
    name: "type",
    expect: groupTypes.toString(),
    actual: t
  })
  let subscription = await c.services.db
    .getChannelSubscriptionByChannelIDAndType(c.session.channel.id, t)
  const now = new Date()
  if(subscription) {
    subscription = { ...subscription, enabled: true, updatedAt: now }
  }else {
    subscription = {
      id: `${t}::${c.session.channel.id}`,
      channelId: c.session.channel.id,
      type: t,
      updatedAt: now,
      createdAt: now,
      enabled: true,
      data: {},
    }
  }
  await c.services.db.upsertSubscription(subscription)
  await c.session.sendQuote(c.session.text(`commands.bsbot.subscription-group.success.${t}`))
}
