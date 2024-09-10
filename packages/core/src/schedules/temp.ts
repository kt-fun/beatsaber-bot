import { Config } from '@/config'
import { BotService, DB, Logger, Session } from '@/interface'
import { RenderService } from '@/img-render'
import { APIService } from '@/api'

// export const LBScoreMonitor = async <T>(
//   config: Config,
//   db: DB<T>,
//   render: RenderService,
//   api: APIService,
//   logger: Logger,
//   botService: BotService<T, Session<T>>
// ) => {
//   const channels = await db.getSubscriptionInfoByType('lb-rank')
//   if (channels.length <= 0) {
//     return
//   }
//   const [hitbuf, scorebuf] = await Promise.all([
//     render.renderUrl('https://aiobs.ktlab.io/tmp/lb/hitcnt'),
//     render.renderUrl('https://aiobs.ktlab.io/tmp/lb/score'),
//   ])
//   for (const group of channels) {
//     const session = botService.getSessionByChannelInfo(group.groupChannel)
//     if (!session) {
//       continue
//     }
//     await session.sendImgBuffer(hitbuf, 'image/png')
//     await session.sendImgBuffer(scorebuf, 'image/png')
//   }
// }
