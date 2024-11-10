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
import { createProxiedAPIService, ServiceWithAPIHelper } from '@/api/helper'

export class APIService {
  BeatLeader: ServiceWithAPIHelper<BeatLeaderService>
  ScoreSaber: ServiceWithAPIHelper<ScoreSaberService>
  BeatSaver: ServiceWithAPIHelper<BeatSaverService>
  AIOSaber: ServiceWithAPIHelper<AIOSaberService>
  private constructor(cfg: Config) {
    const bsClient = new BeatSaverClient(cfg)
    const blClient = new BeatLeaderClient(cfg)
    const scClient = new ScoreSaberClient(cfg)
    const aioClient = new AIOSaberClient(cfg)
    this.BeatLeader = new BeatLeaderService(
      bsClient,
      blClient
    ) as unknown as ServiceWithAPIHelper<BeatLeaderService>
    this.BeatSaver = new BeatSaverService(
      bsClient
    ) as unknown as ServiceWithAPIHelper<BeatSaverService>
    this.ScoreSaber = new ScoreSaberService(
      bsClient,
      scClient
    ) as unknown as ServiceWithAPIHelper<ScoreSaberService>
    this.AIOSaber = new AIOSaberService(
      aioClient
    ) as unknown as ServiceWithAPIHelper<AIOSaberService>
  }

  static create(cfg: Config) {
    // return new APIService(cfg)
    const ins = new APIService(cfg)
    const proxied = new Proxy<APIService>(ins, {
      get(target, prop, receiver) {
        const member = target[prop]
        if (member) {
          return createProxiedAPIService(member)
        }
        return undefined
      },
      set(target, property, value, receiver) {
        return false
      },
    })
    return proxied
  }
}
