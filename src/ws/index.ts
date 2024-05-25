import {Context} from "koishi";
import {Config} from "../config";
import {BeatLeaderWS} from "./beatleader";
import {ScoreSaberWS} from "./scoresaber";
import {BeatSaverWS} from "./beatsaver";
import {APIService} from "../service";

class WS {
  closed: boolean;
  closedTime: number;
  // wrapper
  ws: any;
  constructor(ws) {
    this.ws = ws;
    this.closed = false;
    this.ws.addEventListener('close', (evt)=> {
      this.closed = true;
      this.closedTime = Date.now();
    })
  }
  reopen(ws) {
    this.ws = ws;
    this.closed = false;
  }

}


export function pluginWS(ctx:Context, cfg:Config) {
  const logger = ctx.logger('beatsaber-bot.ws')
  const bllogger = logger.extend('BeatSaverWS')
  const bslogger = logger.extend('BeatSaverWS')
  const  api = APIService.create(ctx,cfg)
  const ws = {
    bsws: new WS(BeatLeaderWS(ctx,cfg,api,bslogger)),
    blws: new WS(BeatSaverWS(ctx,cfg,bllogger))
  }

  ctx.setInterval(()=> {
    if(ws.blws.closed) {
      ws.blws.reopen(BeatLeaderWS(ctx, cfg, api, bslogger))
    }
    if(ws.bsws.closed) {
      ws.bsws.reopen(BeatSaverWS(ctx,cfg,bslogger))
    }
  }, 30000)
}
