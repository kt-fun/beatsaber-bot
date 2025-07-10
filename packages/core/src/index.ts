import { getCommands } from "./cmd";
import type {Config} from "./config";
import {getEventHandlers} from "@/events";
import {EventContext} from "@/interface";
export * from './interface'
export * from './config'
export * from './cmd'
export * from './utils'
export * from './services'
export * from '@/common/s3'
export * from '@/common/i18n'
export * from '@/common/render'
export * from '@/core/session'
export * from '@/core/logger'
export { SessionAgent } from '@/core/domain'
export { WSEventHandler, ScheduleEventHandler } from '@/events'

type Ctx = Pick<EventContext, 'config'| 'logger' | 'services' | 'agentService'>

export const getBot = (config: Config, ctx: Ctx) => ({
  commands: getCommands(),
  eventHandlers: getEventHandlers(config, ctx)
})
