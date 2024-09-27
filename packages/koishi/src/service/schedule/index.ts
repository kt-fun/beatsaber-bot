import { APIService, Config, getScheduleTasks } from 'beatsaber-bot-core'
import { Context } from 'koishi'
import { KoishiBotService } from '@/service/session'
import { ImgRender } from '@/service/render'
import { KoishiDB } from '@/service/db'

export const loadSchedule = (ctx: Context, config: Config) => {
  const botService = new KoishiBotService(ctx, config)
  // @ts-ignore
  const logger = ctx.logger('beatsaber-bot.schedule')
  const api = APIService.create(config)
  const render = new ImgRender(config, api, ctx)
  const db = new KoishiDB(ctx)
  const tasks = getScheduleTasks(config)
  const baseCtx = {
    config: config,
    db: db,
    render: render,
    api: api,
    botService: botService,
  }
  for (const task of tasks) {
    const scheduleContext = {
      ...baseCtx,
      logger: logger.extend(task.name),
    }
    ctx.cron(task.cron, () => task.executor(scheduleContext))
  }
}
