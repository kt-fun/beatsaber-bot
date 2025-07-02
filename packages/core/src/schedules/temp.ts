import { ScheduleTaskCtx } from './interface'

export const LBScoreMonitor = async <T>(c: ScheduleTaskCtx<T>) => {
  const channels = await c.services.db.getSubscriptionsByType('lb-rank')
  if (channels.length <= 0) {
    return
  }
  const [hitbuf, scorebuf] = await Promise.all([
    c.services.render.renderUrl('https://aiobs.ktlab.io/tmp/lb/hitcnt'),
    c.services.render.renderUrl('https://aiobs.ktlab.io/tmp/lb/score'),
  ])
  for (const group of channels) {
    const session = c.botService.getSessionByChannelInfo(group.groupChannel)
    if (!session) {
      continue
    }
    await session.sendImgBuffer(hitbuf, 'image/png')
    await session.sendImgBuffer(scorebuf, 'image/png')
  }
}
