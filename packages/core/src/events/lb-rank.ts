import { EventContext } from "@/interface";

export const LBRank = async (c: EventContext) => {
  const channels = await c.services.db.getSubscriptionsByType('lb-rank')
  if (channels.length <= 0) {
    return
  }
  const [hitbuf, scorebuf] = await Promise.all([
    c.services.render.renderUrl('https://aiobs.ktlab.io/tmp/lb/hitcnt', {
      selector: '#render-result',
    }),
    c.services.render.renderUrl('https://aiobs.ktlab.io/tmp/lb/score', {
      selector: '#render-result',
    }),
  ])
  for (const group of channels) {
    const session = await c.agentService.getAgentSessionByChannelInfo(group.channel)
    if (!session) {
      continue
    }
    await session.sendImgBuffer(hitbuf, 'image/png')
    await session.sendImgBuffer(scorebuf, 'image/png')
  }
}
