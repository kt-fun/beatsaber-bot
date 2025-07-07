import { EventHandlerCtx } from "@/core";
import { Config } from "@/config";
import {Services} from "@/interface";

export const LBScoreMonitor = async (c: EventHandlerCtx<Services, Config>) => {
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
    // 获取一个带有 Agent 的 Service
    const session = c.agentService.getAgentSessionByChannelInfo(group.channel)
    if (!session) {
      continue
    }
    await session.sendImgBuffer(hitbuf, 'image/png')
    await session.sendImgBuffer(scorebuf, 'image/png')
  }
}
