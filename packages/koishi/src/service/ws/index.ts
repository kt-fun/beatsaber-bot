import { Context } from 'koishi'
import {
  APIService,
  BeatleaderWSHandler,
  BeatSaverWSHandler,
  Config,
  WSHandler,
} from 'beatsaber-bot-core'
import { KoishiDB } from '@/service/db'
import { KoishiBotService } from '@/service/session'
import { ImgRender } from '@/service/render'

class WS {
  closed: boolean
  closedTime: number
  // wrapper
  ws: any
  constructor(ctx: Context, handler: WSHandler) {
    this.closed = false
    this.ws = getWS(ctx, handler)
    this.ws.addEventListener('close', (evt) => {
      this.closed = true
      this.closedTime = Date.now()
    })
  }
  reopen(ws) {
    this.ws = ws
    this.closed = false
  }
}

const getWS = (ctx: Context, handler: WSHandler) => {
  // @ts-ignore
  const ws = ctx.http.ws(handler.wsUrl)
  ws.addEventListener('open', () => handler.onOpen?.())
  ws.addEventListener('close', () => handler.onClose?.())
  ws.addEventListener('message', (e) => handler.onEvent?.(e?.data))
  return ws
}

export function loadWS(ctx: Context, cfg: Config) {
  const botService = new KoishiBotService(ctx, cfg)
  // @ts-ignore
  const logger = ctx.logger('beatsaber-bot.ws')
  const bllogger = logger.extend('BeatLeaderWS')
  const bslogger = logger.extend('BeatSaverWS')
  const api = APIService.create(cfg)
  const render = new ImgRender(cfg, api, ctx)
  const db = new KoishiDB(ctx)
  const bsHandler = new BeatSaverWSHandler(
    db,
    render,
    bslogger,
    cfg,
    botService
  )
  const blHandler = new BeatleaderWSHandler(
    db,
    render,
    bllogger,
    cfg,
    botService
  )
  const ws = {
    bsws: new WS(ctx, bsHandler),
    blws: new WS(ctx, blHandler),
  }
  // @ts-ignore
  ctx.setInterval(() => {
    if (ws.blws.closed) {
      ws.blws.reopen(getWS(ctx, bsHandler))
    }
    if (ws.bsws.closed) {
      ws.bsws.reopen(getWS(ctx, bsHandler))
    }
  }, 30000)
}
