import { Context } from 'koishi'
import type {
  Config,
  WSEventHandler,
  EventHandlerRegistry
} from 'beatsaber-bot-core'
import { KoishiBotService } from '../support/session'
import {createServices} from "../support/services";
import {AgentHolder} from "../support/agent";
import {getBot} from "beatsaber-bot-core";
class WS {
  closed: boolean
  closedTime: number
  ws: WebSocket
  handler: WSEventHandler
  ctx: Context
  getWS: () => WebSocket
  constructor(ctx: Context, handler: WSEventHandler, registry: EventHandlerRegistry) {
    this.closed = false
    this.handler = handler
    this.getWS = () => getWS(ctx, handler, registry)
    this.ws = this.getWS()
    this.ws.addEventListener('close', (evt) => {
      this.closed = true
      this.closedTime = Date.now()
    })
  }
  reopen() {
    const ws = this.getWS()
    ws.addEventListener('close', (evt) => {
      this.closed = true
      this.closedTime = Date.now()
    })
    this.ws = ws
    this.closed = false
  }

  keep() {
    if (this.closed) {
      this.reopen()
    }
  }
}

const getWS = (ctx: Context, handler: WSEventHandler, registry: EventHandlerRegistry) => {
  const ws = ctx.http.ws(handler.url)
  const logger = ctx.logger('beatsaber-bot.ws').extend(handler.handlerId)
  ws.addEventListener('open', () => logger.info(`WS handler[${handler.handlerId}] open`))
  ws.addEventListener('close', () => logger.info(`WS handler[${handler.handlerId}] closed`))
  ws.addEventListener('message', async (e) => {
    let data
    try {
      data = JSON.parse(e.data)
    }catch (e) {
      return
    }
    return registry.handleEvent({
      type: 'websocket',
      handlerId: handler.handlerId,
      data: data,
    })
  })
  return ws
}


export function loadWS(ctx: Context, cfg: Config) {
  const logger = ctx.logger('beatsaber-bot.ws')
  const agentHolder = new AgentHolder(ctx)
  const botService = new KoishiBotService(ctx, agentHolder, cfg)
  const services = createServices(ctx, cfg, logger)
  const baseCtx = {
    config: cfg,
    logger,
    services,
    agentService: botService
  }

  const eventHandlerRegistry = getBot(cfg, baseCtx).eventHandlers
  const eventHandlers = eventHandlerRegistry.getHandlersByType<WSEventHandler>('websocket')
  const wss = []
  for(const handler of eventHandlers) {
    wss.push(new WS(ctx, handler, eventHandlerRegistry))
  }
  ctx.setInterval(() => {
    wss.forEach((ws) => ws.keep())
  }, 30000)


}
