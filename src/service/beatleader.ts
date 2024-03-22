import {BeatLeaderClient, BeatSaverClient} from "./api";
import {sortScore} from "./utils/sortScore";


interface MapDiffOption {
  difficulty?: string,
  mode?: string,
}

export const BeatLeaderService = (
  bsClient:BeatSaverClient,
  blClient: BeatLeaderClient
)=>{

  return {

    getScoreByPlayerIdAndMapId: async (playerId: string, mapId: string, option?: MapDiffOption) => {
      const map = await bsClient.searchMapById(mapId)
      if(!map) {
        return null
      }

      const hash = map.versions[0].hash
      let reqs = map.versions[0].diffs.map(it=>({
        diff:it.difficulty,
        mode: it.characteristic,
        hash:hash,
        playerID: playerId,
        leaderboardContext:'general'
      }))
      if(option && option.difficulty) {
        reqs = reqs.filter(item=>item.diff == option.difficulty)
      }
      if(option && option.mode) {
        reqs = reqs.filter(item=>item.mode == option.mode)
      }
      const res = await Promise.all(reqs.map(item=> {
        return blClient.getPlayerScore(item)
      }))
      const scores = res.filter(item => item != null)
      // todo sort score
      if(scores.length < 1) {
        return  null
      }
      scores.sort(sortScore)
      return scores[0]
    }

  }
}
