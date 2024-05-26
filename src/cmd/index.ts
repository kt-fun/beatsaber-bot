import { Command, Context, Logger } from 'koishi'
import { Config } from '../config'
import { APIService, RenderService } from '../service'

export * from './key-search'
export * from './id-search'
export * from './latest'
export * from './rank'
export * from './me'
export * from './whois'
export * from './cmp'
export * from './score'
export * from './help'
export * from './bind'
export * from './subscribe'
export default class Cmd {
  private readonly config: Config
  private readonly ctx: Context
  private readonly apiService: APIService
  private readonly renderService: RenderService
  private readonly logger: Logger
  private cmds: Record<string, Command> = {}
  constructor(ctx: Context, config: Config) {
    this.config = config
    this.ctx = ctx
    this.apiService = APIService.create(ctx, config)
    this.renderService = RenderService.create(ctx, config, this.apiService)
    this.logger = this.ctx.logger('beatsaber-bot.cmds')
  }
  apply(
    fc: (
      ctx: Context,
      cfg: Config,
      renderService: RenderService,
      apiService: APIService,
      logger: Logger
    ) => {
      key: string
      cmd: Command
    }
  ) {
    const cmd = fc(
      this.ctx,
      this.config,
      this.renderService,
      this.apiService,
      this.logger
    )
    const res = this.cmds[cmd.key]
    if (res) {
      const previous = this.cmds[cmd.key]
      this.logger.warn(
        `命令 ${cmd.key} 正在被重复初始化，先前的重名命令会被覆盖：${previous.name}`
      )
      previous.dispose()
    }
    this.cmds[cmd.key] = cmd.cmd
    return this
  }
}
