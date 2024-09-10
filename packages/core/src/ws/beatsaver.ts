import { WSHandler } from '@/ws/handler'
import { Logger } from '@/interface/logger'
import { RenderService } from '@/img-render'
import { Config } from '@/config'
import { DB } from '@/interface/db'
import { BeatSaverWSEvent } from '@/api/interfaces/beatsaver'
import { BotService, Session } from '@/interface'

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

  async onEvent(event: any) {
    const data = JSON.parse(event.toString()) as BeatSaverWSEvent
    // this.logger.info('Beatsaver message received', data.type, data?.msg?.id)
    if (data.type === 'MAP_UPDATE') {
      const bsmap = data.msg
      if (!bsmap.versions.some((it) => it.state == 'Published')) {
        return
      }
      if (bsmap.declaredAi != 'None') {
        return
      }
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
        const session = this.botService.getSessionByChannelInfo(
          item.groupChannel
        )
        if (!session) {
          continue
        }
        await session.send(
          `本群谱师 「<at id="${item.account.uid}"/> (${bsmap.uploader.name})」刚刚发布了新谱面，「${bsmap.name}」`
        )
        // text + mention element
        await session.send(await image)
        await session.sendAudioByUrl(bsmap.versions[0].previewURL)
      }
    }
  }
}
