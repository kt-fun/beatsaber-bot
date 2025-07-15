import {LBRank} from "./lb-rank";
import {BeatleaderScore} from "./beatleader-score";
import {BeatsaverMap} from "./beatsaver-map";
import { EventHandlerRegistry } from "@/core/event-handler-registry";

import {Config} from "@/config";
import { EventContext } from "@/interface";
type Ctx = Pick<EventContext, 'config' | 'services' | 'agentService'>

export type ScheduleEventHandler = {
  type: 'schedule',
  handler: (ctx: EventContext) => Promise<void>
  handlerId: string
  cron?: string
  enabled?: boolean
}

export type WSEventHandler = {
  type: 'websocket',
  handlerId: string
  handler: (ctx: EventContext) => Promise<void>
  url: string
  enabled?: boolean
}

export const getEventHandlers = (ctx: Ctx) => {
  const config = ctx.config
  const handlers = [
    {
      type: 'schedule' as const,
      handlerId: 'lb-rank',
      handler: LBRank,
      cron: config.cron.temp?.cron,
      enabled: config.cron.temp?.enabled
    },
    {
      type: 'websocket' as const,
      handlerId: 'ws-beatleader-score',
      handler: BeatleaderScore,
      url: 'wss://sockets.api.beatleader.xyz/scores'
    },
    {
      type: 'websocket' as const,
      handlerId: 'ws-beatsaver-map',
      handler: BeatsaverMap,
      url: 'wss://ws.beatsaver.com/maps'
    },
  ]
  return new EventHandlerRegistry(handlers, ctx)
}
