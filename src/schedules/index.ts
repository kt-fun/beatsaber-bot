import { Context } from 'koishi'
import { Config } from '../config'
import beatSaverAlertMonitor from './BeatSaverAlertMonitor'
import { APIService, RenderService } from '../service'
import { ScoreMonitor } from './temp'
import oauthTokenRefreshTask from './oauthTokenRefreshTask'

export default function schedules(ctx: Context, config: Config) {
  const api = APIService.create(ctx, config)
  const render = RenderService.create(ctx, config, api)
  ScoreMonitor(
    ctx,
    config,
    render,
    api,
    ctx.logger('bsbot.schedules.beatsaver.scoreMonitor')
  )
  ctx.cron(
    config.bsNotifyMonitorCron,
    beatSaverAlertMonitor(
      ctx,
      config,
      render,
      api,
      ctx.logger('bsbot.schedules.beatsaver.alertMonitor')
    )
  )
  ctx.cron(
    config.tokenRefreshCron,
    oauthTokenRefreshTask(
      ctx,
      config,
      api,
      ctx.logger('bsbot.schedules.task.oauthTokenRefresh')
    )
  )
}
