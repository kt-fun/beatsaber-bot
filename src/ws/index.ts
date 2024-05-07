import {Context} from "koishi";
import {Config} from "../config";
import {BeatLeaderWS} from "./beatleader";
import {ScoreSaberWS} from "./scoresaber";
import {BeatSaverWS} from "./beatsaver";

class WS {
  closed: boolean;
  closedTime: number;
  // wrapper
  ws: any;
  constructor(ws) {
    this.ws = ws;
    this.closed = false;
    this.ws.on('close', ()=> {
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
  const ws = {
    bsws: new WS(BeatLeaderWS(ctx,cfg,bslogger)),
    blws: new WS(BeatSaverWS(ctx,cfg,bllogger))
  }
  
  ctx.setInterval(()=> {
    if(ws.blws.closed) {
      ws.blws.reopen(BeatLeaderWS(ctx,cfg,bslogger))
    }
    if(ws.bsws.closed) {
      ws.bsws.reopen(BeatSaverWS(ctx,cfg,bslogger))
    }
  }, 30000)
}
