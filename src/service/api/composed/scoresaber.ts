import {BeatSaverClient, ScoreSaberClient} from "../base";
import {sortScore} from "../sortScore";
import {BSMap, HashResponse} from "../../../types";
import {ScoreSaberItem} from "../../../img-render/interface/scoresaber";

export class ScoreSaberService {
  bsClient: BeatSaverClient
  scClient:ScoreSaberClient
  constructor(
    bsClient: BeatSaverClient,
    scClient:ScoreSaberClient
  ) {
    this.bsClient = bsClient
    this.scClient = scClient
  }
  getScoreUserById (id:string){
    return this.scClient.getScoreUserById(id)
  }

  async getScoreByPlayerIdAndMapId(playerId: string, mapId: string)  {
      const map = await this.bsClient.searchMapById(mapId)
      if(!map) {
        return null
      }
      const hash = map.versions[0].hash
      const reqs = map.versions[0].diffs.map(it=>({
        diff:it.difficulty,
        mode: it.characteristic,
        hash:hash,
        playerID: playerId,
        leaderboardContext:'general'
      }))
      const res = await Promise.all(reqs.map(item=> {
        // return scClient.getPlayerScore(item)
        return null
      }))
      const scores = res.filter(item => item != null)
      // todo sort score
      if(scores.length < 1) {
        return  null
      }
      scores.sort(sortScore)
      return scores[0]
  }

  getScoreInfoById (id:string, page: number){
      return this.scClient.getScoreItemsById(id, page)
  }
  async getPlayerRecentScoreWithUserInfo(uid: string) {
    const userInfo = this.getScoreUserById(uid)
    const scores = await this.scClient.getScoreItemsById(uid, 1, 24)
      .then(res=> res.playerScores)
    const awaitedUserInfo = await userInfo

    const hashes = scores.map(it=> it.leaderboard.songHash)

    let hashInfo = await this.bsClient.getMapsByHashes(hashes)
    if(hashInfo.id) {
      const map = hashInfo as BSMap
      hashInfo = {} as HashResponse
      hashInfo[map.versions[0].hash] = map
    }
    let res = scores.map(it=> ({
      mapId: (hashInfo as HashResponse)[it.leaderboard.songHash.toLowerCase()]?.id,
      ...it
    } as ScoreSaberItem))
    return {
      scores: res,
      userInfo: awaitedUserInfo.data
    }
  }

}
