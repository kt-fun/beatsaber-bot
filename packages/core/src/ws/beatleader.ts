import { WSHandler } from '@/ws/handler'
import { Logger } from '@/interface/logger'
import { Config } from '@/config'
import { DB } from '@/interface/db'
import { BotService, Session } from '@/interface'
import {RenderService} from "@/service/render";
import {BeatLeaderWSEvent} from "@/service/api/interfaces/beatleader";

export class BeatleaderWSHandler<T> implements WSHandler {
  private readonly logger: Logger
  private render: RenderService
  private botService: BotService<T, Session<T>>
  wsUrl: string = 'wss://sockets.api.beatleader.xyz/scores'
  private db: DB<T>
  config: Config
  constructor(
    db: DB<T>,
    render: RenderService,
    logger: Logger,
    config: Config,
    botService: BotService<T, Session<T>>
  ) {
    this.logger = logger
    this.render = render
    this.botService = botService
    this.config = config
    this.db = db
  }

  onOpen() {
    this.logger.info('BeatleaderWS opened')
  }

  onClose() {
    this.logger.info('BeatleaderWS closed')
  }

  async onEvent(event: any) {
    const data = JSON.parse(event.toString()) as BeatLeaderWSEvent
    const playerId = data.player.id
    // const ok = BeatLeaderFilter(data, ...this.config.BLScoreFilters)
    // if (!ok) {
    //   return
    // }
    // logger.info('Received beatleader message',data.id, data.player.id);
    // cache all playerId
    const subscriptions = await this.db.getAllSubscriptionByUIDAndPlatform(playerId, 'beatleader')
    // .filter(item=> {
    //   const channelFilters = item.sub.data as BLScoreFilter[]
    //   const memberFilters = item.member.subscribeData
    //   return BeatLeaderFilter(data, ...channelFilters, ...memberFilters)
    // })
    const restSub = subscriptions.filter((it) =>
      it.subscribe.type == 'beatleader-score' && it.subscribe.enable == true
    )
    // cacheService
    if (restSub.length === 0) return
    const img = await this.render.renderScore(data.id.toString())
    for (const item of restSub) {
      const session = this.botService.getSessionByChannelInfo(item.groupChannel)
      if (!session) {
        continue
      }
      await session.send(
        `恭喜 <at id="${item.account.uid}"/> 刚刚在谱面「${data.leaderboard.song.name}」中打出了 ${(data.accuracy * 100).toFixed(2)}% 的好成绩`
      )
      await session.sendImgBuffer(img)
    }
  }
}
