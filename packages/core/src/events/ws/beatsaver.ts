import { WSHandler } from './handler'
import {AgentService, EventHandlerCtx, Logger} from '@/core'
import { Config } from '@/config'
import { DB } from '@/interface/db'
import { handleWSEventWithCache } from '@/utils'
import {BeatSaverWSEvent, BSMap} from "@/services/api/interfaces/beatsaver";
import {RenderService} from "@/services";
import {Services} from "@/interface";
export class BeatSaverWSHandler<T> implements WSHandler {
  private readonly logger: Logger
  private render: RenderService
  private agentService: AgentService
  wsUrl: string = 'wss://ws.beatsaver.com/maps'
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
    this.logger.info('BeatsaverWS opened')
  }

  onClose() {
    this.logger.info('BeatsaverWS closed')
  }

  eventParser(event) {
    return JSON.parse(event.toString()) as BeatSaverWSEvent
  }

  eventFilter = (data: BeatSaverWSEvent) => {
    return (
      data.type === 'MAP_UPDATE' &&
      data.msg.versions.some((it) => it.state == 'Published') &&
      data.msg.declaredAi === 'None'
    )
  }
  eventIdSelector = (data: BeatSaverWSEvent) =>
    `ws.bs.${data.type === 'MAP_DELETE' ? data.msg : data.msg.id}.${data.type}`

  async BSWSHandler(data: BeatSaverWSEvent) {
    // this.logger.info('Beatsaver message received', data.type, data?.msg?.id)

    const bsmap = data.msg as BSMap
    const userId = bsmap.uploader.id
    const subscriptions = await this.db.getAllSubscriptionByUIDAndPlatform(
      String(userId),
      'beatsaver'
    )

    const restSub = subscriptions.filter(
      (it) =>
        it.subscription.type == 'beatsaver-map' && it.subscription.enabled == true
    )
    const gids = restSub.map((it) => it.channel.id)
    const groupSubs = await this.db.getIDSubscriptionByType('id-beatsaver-map')
    const restGroupSubs = groupSubs.filter(
      (it) =>
        !gids.includes(it.channel.id) &&
        it.subscription.data?.mapperId?.toString() === userId.toString()
    )

    // cacheService
    if (restSub.length === 0 && restGroupSubs) return
    const image = this.render.renderMap(bsmap)
    for (const item of restSub) {
      const session = this.agentService.getAgentSessionByChannelInfo(item.channel)
      if (!session) {
        continue
      }
      await session.send(
        `本群谱师 「<at id="${item.account.userId}"/> (${bsmap.uploader.name})」刚刚发布了新谱面，「${bsmap.name}」`
      )
      // text + mention element
      await session.sendImgBuffer(await image)
      await session.sendAudioByUrl(bsmap.versions[0].previewURL)
    }
    for (const item of restGroupSubs) {
      const session = this.agentService.getAgentSessionByChannelInfo(item.channel)
      if (!session) {
        continue
      }
      await session.send(
        `谱师「${bsmap.uploader.name}」刚刚发布了新谱面，「${bsmap.name}」`
      )
      // text + mention element
      await session.sendImgBuffer(await image)
      await session.sendAudioByUrl(bsmap.versions[0].previewURL)
    }
  }

  onEvent = handleWSEventWithCache(
    this,
    this.BSWSHandler,
    1000 * 60 * 15,
    this.eventParser,
    this.eventFilter,
    this.eventIdSelector
  )
}
