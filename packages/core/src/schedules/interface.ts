import { Config } from '@/config'
import {BotService, DB, Logger, Session} from '@/interface'
import {Services} from "@/service";

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
  enable: boolean
}
