import { Config } from '@/config'
import { BotService, DB, Logger, Session } from '@/interface'
import { RenderService } from '@/img-render'
import { APIService } from '@/api'

export type ScheduleTaskCtx<T> = {
  config: Config
  db: DB<T>
  render: RenderService
  api: APIService
  logger: Logger
  botService: BotService<T, Session<T>>
}

export type ScheduleTask = {
  name: string
  cron: string
  executor: <T>(c: ScheduleTaskCtx<T>) => Promise<void>
}
