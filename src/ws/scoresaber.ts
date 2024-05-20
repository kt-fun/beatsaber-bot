import {Context, Logger} from "koishi";
import {Config} from "../config";

export function ScoreSaberWS(ctx: Context, config:Config, logger:Logger) {
  const ws = ctx.http.ws("wss://scoresaber.com/ws") as any
  ws.on('open', (ev)=> {
    logger.info("ScoreSaberWS opened");
  })
  ws.on('message', (message)=> {
    return
    // if(!isBinary) {
    //   try {
    //     const data = JSON.parse(message.toString())
    //   }catch(e){
    //     logger.info("BeatleaderWS error", e);
    //   }
    //
    // }
  })
  ws.on('close', (evt)=> {
    logger.info("ScoreSaberWS closed");
  })
  return ws
}
