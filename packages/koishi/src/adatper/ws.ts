import { Context } from 'koishi'
import {
  BeatleaderWSHandler,
  BeatSaverWSHandler,
  Config,
  WSHandler,
} from 'beatsaber-bot-core'
import { KoishiBotService } from './session'
import {createServices} from "./services";
import {AgentHolder} from "@/adatper/agent";
class WS {
  closed: boolean
  closedTime: number
  ws: WebSocket
  handler: WSHandler
  ctx: Context
  constructor(ctx: Context, handler: WSHandler) {
    this.closed = false
    this.handler = handler
    this.ws = getWS(ctx, handler)
    this.ws.addEventListener('close', (evt) => {
      this.closed = true
      this.closedTime = Date.now()
    })
  }
  reopen() {
    const ws = getWS(this.ctx, this.handler)
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

const getWS = (ctx: Context, handler: WSHandler) => {
  const ws = ctx.http.ws(handler.wsUrl)
  ws.addEventListener('open', () => handler.onOpen?.())
  ws.addEventListener('close', () => handler.onClose?.())
  ws.addEventListener('message', (e) => handler.onEvent?.(e?.data))
  return ws
}


export function loadWS(ctx: Context, agentHolder: AgentHolder, cfg: Config) {
  const logger = ctx.logger('beatsaber-bot.ws')
  const bllogger = logger.extend('BeatLeaderWS')
  const bslogger = logger.extend('BeatSaverWS')
  // agent holder

  const services = createServices(ctx, cfg, logger)
  const botService = new KoishiBotService(ctx, agentHolder, cfg)
  const bsHandler = new BeatSaverWSHandler(
    services.db,
    services.render,
    bslogger,
    cfg,
    botService
  )

  const blHandler = new BeatleaderWSHandler(
    services.db,
    services.render,
    bllogger,
    cfg,
    botService
  )

  // const wss = [
  //   new WS(ctx, bsHandler),
  //   new WS(ctx, blHandler)
  // ]
  // ctx.setInterval(() => {
  //   wss.forEach((ws) => ws.keep())
  // }, 30000)
}
