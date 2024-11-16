import { WSHandler } from '@/ws/handler'
import { Logger } from '@/interface/logger'
import { RenderService } from '@/img-render'
import { Config } from '@/config'
import { DB } from '@/interface/db'
import { BeatSaverWSEvent, BSMap } from '@/api/interfaces/beatsaver'
import { BotService, Session } from '@/interface'
import { cache, handleWSEventWithCache } from '@/utils'

export class BeatSaverWSHandler<T> implements WSHandler {
  private readonly logger: Logger
  private render: RenderService
  private botService: BotService<T, Session<T>>
  wsUrl: string = 'wss://ws.beatsaver.com/maps'
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
    const subscriptions = await this.db.getAllSubScriptionByUIDAndPlatform(
      userId,
      'beatsaver'
    )
    const restSub = subscriptions.filter(
      (it) =>
        it.subscribe.type == 'beatsaver-map' && it.subscribe.enable == true
    )
    // cacheService
    if (restSub.length === 0) return
    const image = this.render.renderMap(bsmap)
    for (const item of restSub) {
      const session = this.botService.getSessionByChannelInfo(item.groupChannel)
      if (!session) {
        continue
      }
      await session.send(
        `本群谱师 「<at id="${item.account.uid}"/> (${bsmap.uploader.name})」刚刚发布了新谱面，「${bsmap.name}」`
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
