import { WSHandler } from '@/ws/handler'
import { Logger } from '@/interface/logger'
import { RenderService } from '@/img-render'
import { Config } from '@/config'
import { DB } from '@/interface/db'
import { BotService, Session } from '@/interface'

export class ScoresaberWSHandler<T> implements WSHandler {
  private readonly logger: Logger
  private render: RenderService
  private botService: BotService<T, Session<T>>
  wsUrl: string = 'wss://scoresaber.com/ws'
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
    this.logger.info('ScoreSaberWS opened')
  }

  onClose() {
    this.logger.info('ScoreSaberWS closed')
  }

  async onEvent(event: any) {
    return
    // if(!isBinary) {
    //   try {
    //     const data = JSON.parse(message.toString())
    //   }catch(e){
    //     logger.info("BeatleaderWS error", e);
    //   }
    //
    // }
  }
}
