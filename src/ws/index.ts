import {Context} from "koishi";
import {Config} from "../config";
import {BeatLeaderWS} from "./beatleader";
import {ScoreSaberWS} from "./scoresaber";
import {BeatSaverWS} from "./beatsaver";

export function pluginWS(ctx:Context, cfg:Config) {
  const logger = ctx.logger('beatsaber-bot.ws')
  const ws = []
  const bsws = BeatLeaderWS(ctx,cfg,logger.extend('BeatLeaderWS'))
  // const ssws = ScoreSaberWS(ctx,cfg,logger.extend('ScoreSaberWS'))
  const blws = BeatSaverWS(ctx,cfg,logger.extend('BeatSaverWS'))

}
