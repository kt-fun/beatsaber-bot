import {botCommands} from "./cmd";
import type {Config} from "./config";
import {getScheduleTasks} from "./events/schedules";
export * from './interface'
export * from './events/schedules'
export * from './config'
export * from './cmd'
export * from './events/ws'
export * from './utils'
export * from './services'
export * from '@/common/s3'
export * from '@/common/render'
export * from '@/core/session'
export * from '@/core/logger'
export { SessionAgent } from '@/core/domain'

export const getBot = (config: Config) => ({
  commands: botCommands(),
  schedule: getScheduleTasks(config),
})

