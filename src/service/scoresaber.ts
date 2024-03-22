import {BeatSaverClient, ScoreSaberClient} from "./api";
import {sortScore} from "./utils/sortScore";

export const ScoreSaberService = (
  bsClient: BeatSaverClient,
  scClient:ScoreSaberClient,
)=>{

  return {
    ... scClient,
    getImgByScoreId: () => {

    },

    getScoreByPlayerIdAndMapId: async (playerId: string, mapId: string) => {
      const map = await bsClient.searchMapById(mapId)
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

  }
}
