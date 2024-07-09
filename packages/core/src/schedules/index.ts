import { Config } from '@/config'
import { BotService, DB, Logger, Session } from '@/interface'
import { RenderService } from '@/img-render'
import { APIService } from '@/api'

type ScheduleTask = <T>(
  config: Config,
  db: DB<T>,
  render: RenderService,
  api: APIService,
  logger: Logger,
  botService: BotService<T, Session<T>>
) => Promise<void>

export * from './temp'
export * from './oauthTokenRefreshTask'
