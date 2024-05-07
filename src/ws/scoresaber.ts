import {Context, Logger} from "koishi";
import {Config} from "../config";

export function ScoreSaberWS(ctx: Context, config:Config, logger:Logger) {
  const ws = ctx.http.ws("wss://scoresaber.com/ws")
  ws.on('open', (code, reason)=> {
    logger.info("ScoreSaberWS opened");
  })
  ws.on('message', (message,isBinary)=> {
    return
    if(!isBinary) {
      try {
        const data = JSON.parse(message.toString())
      }catch(e){
        logger.info("BeatleaderWS error", e);
      }

    }
  })
  ws.on('close', (code, reason)=> {
    logger.info("ScoreSaberWS closed");
  })
  return ws
}
