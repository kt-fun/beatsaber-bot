import { getCommands } from "./cmd";
import type {Config} from "./config";
import {getEventHandlers} from "@/events";
import {EventContext} from "@/interface";
import {APIService, RenderService} from "@/services";
import {Logger} from "@/core";
import {I18nService} from "@/common/i18n";
import {S3Service} from "@/common/s3";
import {createCache} from "@/common/cache";
import type {CreateImageRenderOption} from "@/common/render";
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
export {EventHandlerRegistry} from '@/core/event-handler-registry'
type Ctx = Pick<EventContext, 'config' | 'services' | 'agentService'>

export const getBot = (config: Config, ctx: Ctx) => ({
  commands: getCommands(),
  eventHandlers: getEventHandlers(config, ctx)
})

export const createCommonService = (config: Config, logger: Logger) => {
  let s3: S3Service
  if(config.s3.enabled) {
    s3 = new S3Service(config.s3)
  }
  return {
    api: new APIService(config, logger),
    i18n: new I18nService(),
    s3,
    cache: createCache({
      max: 500,
      size: 50,
      sizeCalculation: () => 1,
      maxSize: 5000,
      allowStale: false,
      updateAgeOnGet: false,
      noUpdateTTL: true,
      ttl: 15 * 60 * 1000,
    })
  }
}
