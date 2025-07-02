import {botCommands} from "./cmd";
import {getScheduleTasks} from "./schedules";
import {Config} from "./config";

export * from './interface'
export * from './schedules'
export * from './config'
export * from './cmd'
export * from './ws'
export * from './utils'
export * from './service'
export * from './infra'

export const getBot = <T>(config: Config) => ({
  commands: botCommands<T>(),
  schedule: getScheduleTasks(config),
})

