import { APIService, Config, LBScoreMonitor } from 'beatsaber-bot-core'
import { Context } from 'koishi'
import { KoishiBotService } from '@/session-impl'
import { ImgRender } from '@/service'
import { KoishiDB } from '@/service/db'

export const loadSchedule = (ctx: Context, config: Config) => {
  const botService = new KoishiBotService(ctx)
  // @ts-ignore
  const logger = ctx.logger('beatsaber-bot.schedule')
  const api = APIService.create(config)
  const render = new ImgRender(config, api, ctx)
  const db = new KoishiDB(ctx)
  ctx.cron(config.tempCron, async () => {
    await LBScoreMonitor(config, db, render, api, logger, botService)
  })
}
