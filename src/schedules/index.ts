import {Context} from "koishi";
import {Config} from "../config";
import beatSaverAlertMonitor from "./BeatSaverAlertMonitor";
import {APIService} from "../service";
import {ScoreMonitor} from "./temp";

export default function schedules(ctx:Context,config:Config) {
  const api = new APIService(ctx,config)
  ScoreMonitor(ctx,config,api,ctx.logger('bsbot.schedules.beatsaver.scoreMonitor'))
  ctx.cron(config.bsNotifyMonitorCron,beatSaverAlertMonitor(ctx,config,api,ctx.logger('bsbot.schedules.beatsaver.alertMonitor')))
}
