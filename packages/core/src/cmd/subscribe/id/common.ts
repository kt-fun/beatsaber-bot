import {CmdContext} from "@/interface";

export const subById = async (c: CmdContext, id: string, type: string, extraData: any) => {
  let it = await c.services.db.getSubscriptionByID(id)
  const now = new Date()
  if (it) {
    it.enabled = true
    it.updatedAt = now
  }else {
    it = {
      id: id,
      channelId: c.session.channel.id,
      type: type,
      enabled: true,
      data: extraData,
      createdAt: now,
      updatedAt: now
    }
  }
  await c.services.db.upsertSubscription(it)
  await c.session.sendQuote(c.session.text(`commands.bsbot.subscription.success.${type}`, extraData))
}

