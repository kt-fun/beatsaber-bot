import {Context, h} from "koishi";
import {Config} from "../config";
import {BeatLeaderService} from "./beatleader";
import {aioRequest, blRequest, bsRequest, scRequest} from "./api";
import {BeatSaverService} from "./beatsaver";
import {ScoreSaberService} from "./scoresaber";
import {AIOSaberService} from "./aiosaber";
import {NetReqResult} from "./utils/handlerError";

export class APIService {
  BeatLeader: ReturnType<typeof BeatLeaderService>
  ScoreSaber: ReturnType<typeof ScoreSaberService>
  BeatSaver: ReturnType<typeof BeatSaverService>
  AIOSaber:ReturnType<typeof AIOSaberService>
  constructor(ctx:Context, cfg: Config) {
    const bsClient = bsRequest(ctx,cfg)
    const blClient = blRequest(ctx,cfg)
    const scClient = scRequest(ctx,cfg)
    const aioClient = aioRequest(ctx,cfg)
    this.BeatLeader = BeatLeaderService(bsClient, blClient)
    this.BeatSaver = BeatSaverService(bsClient)
    this.ScoreSaber = ScoreSaberService(bsClient, scClient)
    this.AIOSaber = AIOSaberService(aioClient)
  }

  async withRetry<T>(block:() => Promise<NetReqResult<T>>,times:number = 1,onRetry?:(retryTime:number)=>void):Promise<NetReqResult<T>> {
    let result:NetReqResult<T>
    while (times > 0) {
      try {
        result = await block()
        return result
      }catch (e) {
        if(times-- > 1) {
          onRetry(times)
          continue
        }
        return NetReqResult.failed<T>(`retry times reached, ${e}`)
      }
    }
    if(result) {
      return result
    }
    return NetReqResult.failed<T>("unknown error")
  }
}
