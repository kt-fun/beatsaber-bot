import { Config } from '@/config'
import {Services, BotService, Logger, Session} from '@/interface'

export type ScheduleTaskCtx<T> = {
  config: Config
  logger: Logger
  services: Services<T>
  botService: BotService<T, Session<T>>
}

export type ScheduleTask = {
  name: string
  cron: string
  handler: <T>(c: ScheduleTaskCtx<T>) => Promise<void>
  enabled: boolean
}
