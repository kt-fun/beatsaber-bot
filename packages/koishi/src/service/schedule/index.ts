import { APIService, Config } from 'beatsaber-bot-core'
import { Context } from 'koishi'
import { KoishiBotService } from '@/service/session'
import { ImgRender } from '@/service/render'
import { KoishiDB } from '@/service/db'

export const loadSchedule = (ctx: Context, config: Config) => {
  const botService = new KoishiBotService(ctx)
  // @ts-ignore
  const logger = ctx.logger('beatsaber-bot.schedule')
  const api = APIService.create(config)
  const render = new ImgRender(config, api, ctx)
  const db = new KoishiDB(ctx)
}
