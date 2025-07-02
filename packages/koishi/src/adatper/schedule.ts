import {Context} from "koishi";
import { KoishiBotService } from "@/service";
import {Config, getBot} from "beatsaber-bot-core";
import {createServices} from "@/adatper/services";

export const loadSchedule = (ctx: Context, config: Config) => {
  const botService = new KoishiBotService(ctx, config)
  // @ts-ignore
  const logger = ctx.logger('beatsaber-bot.schedule')
  // @ts-ignore
  const services = createServices(ctx, cfg, logger)
  const tasks = getBot(config).schedule.filter((task) => task.enable)
  const baseCtx = {
    config: config,
    services,
    botService: botService,
  }
  for (const task of tasks) {
    const scheduleContext = {
      ...baseCtx,
      logger: logger.extend(task.name),
    }
    logger.info(`schedule ${task.name} init, ${task.cron}`)
    ctx.cron(task.cron, () => task.handler(scheduleContext))
  }
}
