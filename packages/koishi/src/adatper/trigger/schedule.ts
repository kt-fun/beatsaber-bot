import {Context} from "koishi";
import { KoishiBotService } from "../support/session";
import { Config, getBot } from "beatsaber-bot-core";
import { createServices } from "../support/services";
import {AgentHolder} from "../support/agent";
import {ScheduleEventHandler} from "beatsaber-bot-core";

export const loadSchedule = (ctx: Context, config: Config) => {
  const agentHolder = new AgentHolder(ctx)
  const botService = new KoishiBotService(ctx, agentHolder, config)
  const logger = ctx.logger('beatsaber-bot.schedule')
  const services = createServices(ctx, config, logger)
  const baseCtx = {
    config,
    services,
    agentService: botService
  }
  const eventHandlers = getBot(config, baseCtx).eventHandlers
    const tasks = eventHandlers.getHandlersByType<ScheduleEventHandler>('schedule')
    .filter((handler) => handler.enabled && handler.cron)

  for (const task of tasks) {
    logger.info(`schedule ${task.handlerId} init, ${task.cron}`)
    ctx.cron(task.cron, () => eventHandlers.handleEvent({
      type: 'schedule',
      handlerId: 'lb-rank',
      data: '',
    }))
  }
}
