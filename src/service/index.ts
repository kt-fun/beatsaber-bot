import {Context} from "koishi";
import {Config} from "../config";
import {BeatLeaderService} from "./beatleader";
import {blRequest, bsRequest, scRequest} from "./api";
import {BeatSaverService} from "./beatsaver";
import {ScoreSaberService} from "./scoresaber";

export class APIService {
  BeatLeader: ReturnType<typeof BeatLeaderService>
  ScoreSaber: ReturnType<typeof ScoreSaberService>
  BeatSaver: ReturnType<typeof BeatSaverService>
  constructor(ctx:Context, cfg: Config) {
    const bsClient = bsRequest(ctx,cfg)
    const blClient = blRequest(ctx,cfg)
    const scClient = scRequest(ctx,cfg)
    this.BeatLeader = BeatLeaderService(bsClient, blClient)
    this.BeatSaver = BeatSaverService(bsClient)
    this.ScoreSaber = ScoreSaberService(bsClient, scClient)
  }
}
