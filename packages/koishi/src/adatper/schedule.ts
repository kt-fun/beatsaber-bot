import {Context} from "koishi";
import { KoishiBotService } from "./session";
import { Config, getBot } from "beatsaber-bot-core";
import { createServices } from "./services";
import {AgentHolder} from "@/adatper/agent";

export const loadSchedule = (ctx: Context, agentHolder: AgentHolder, config: Config) => {
  const botService = new KoishiBotService(ctx, agentHolder, config)
  const logger = ctx.logger('beatsaber-bot.schedule')
  const services = createServices(ctx, config, logger)
  const tasks = getBot(config).schedule.filter((task) => task.enabled)
  const baseCtx = {
    config: config,
    services,
    agentService: botService,
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
