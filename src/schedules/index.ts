import {Context} from "koishi";
import {Config} from "../config";
import beatSaverAlertMonitor from "./BeatSaverAlertMonitor";
import {APIService} from "../service";

export default function schedules(ctx:Context,config:Config) {
  const api = new APIService(ctx,config)
  ctx.setInterval(beatSaverAlertMonitor(ctx,config,api), config.notifyMonitorTriggerInterval)
}
