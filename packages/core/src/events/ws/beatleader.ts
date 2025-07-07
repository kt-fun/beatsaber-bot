import { WSHandler } from './handler'
import { AgentService, Logger } from '@/core'
import { Config } from '@/config'
import { DB } from '@/interface/db'
import {RenderService} from "@/services";
import { BeatLeaderWSEvent } from "@/services/api/interfaces/beatleader";

export class BeatleaderWSHandler<T> implements WSHandler {
  private readonly logger: Logger
  private render: RenderService
  private agentService: AgentService
  wsUrl: string = 'wss://sockets.api.beatleader.xyz/scores'
  private db: DB
  config: Config
  constructor(
    db: DB,
    render: RenderService,
    logger: Logger,
    config: Config,
    agentService: AgentService
  ) {
    this.logger = logger
    this.render = render
    this.agentService = agentService
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
      it.subscription.type == 'beatleader-score' && it.subscription.enabled == true
    )
    // cacheService
    if (restSub.length === 0) return
    const img = await this.render.renderScore(data.id.toString())
    for (const item of restSub) {
      const session = await this.agentService.getAgentSessionByChannelInfo(item.channel)
      if (!session) {
        continue
      }
      await session.send(
        `恭喜 <at id="${item.account.userId}"/> 刚刚在谱面「${data.leaderboard.song.name}」中打出了 ${(data.accuracy * 100).toFixed(2)}% 的好成绩`
      )
      await session.sendImgBuffer(img)
    }
  }
}
