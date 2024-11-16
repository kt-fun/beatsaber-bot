import { Config } from '@/config'
import { BeatLeaderService } from './composed/beatleader'
import { BeatSaverService } from './composed/beatsaver'
import { ScoreSaberService } from './composed/scoresaber'
import { AIOSaberService } from './composed/aiosaber'
import {
  AIOSaberClient,
  BeatLeaderClient,
  BeatSaverClient,
  ScoreSaberClient,
} from '@/api/base'
import { Logger } from '@/interface'

export class APIService {
  BeatLeader: BeatLeaderService
  ScoreSaber: ScoreSaberService
  BeatSaver: BeatSaverService
  AIOSaber: AIOSaberService
  private constructor(cfg: Config, logger: Logger) {
    const bsClient = new BeatSaverClient(cfg, logger)
    const blClient = new BeatLeaderClient(cfg, logger)
    const scClient = new ScoreSaberClient(cfg, logger)
    const aioClient = new AIOSaberClient(cfg, logger)
    this.BeatLeader = new BeatLeaderService(bsClient, blClient)
    this.BeatSaver = new BeatSaverService(bsClient)
    this.ScoreSaber = new ScoreSaberService(bsClient, scClient)
    this.AIOSaber = new AIOSaberService(aioClient)
  }

  static create(cfg: Config, logger: Logger) {
    return new APIService(cfg, logger)
    // const ins = new APIService(cfg)
    // const proxied = new Proxy<APIService>(ins, {
    //   get(target, prop, receiver) {
    //     const member = target[prop]
    //     if (member) {
    //       return createProxiedAPIService(member)
    //     }
    //     return undefined
    //   },
    //   set(target, property, value, receiver) {
    //     return false
    //   },
    // })
    // return proxied
  }
}
