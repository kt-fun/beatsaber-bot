import { BeatLeaderClient, BeatSaverClient } from '../base'
import { sortScore } from '../sortScore'
import { Leaderboard } from '../interfaces/beatleader'
import { decode } from '@/img-render/utils/bl/bsorDecoder'

interface MapDiffOption {
  difficulty?: string
  mode?: string
}

export class BeatLeaderService {
  private bsClient: BeatSaverClient
  private blClient: BeatLeaderClient
  constructor(bsClient: BeatSaverClient, blClient: BeatLeaderClient) {
    this.bsClient = bsClient
    this.blClient = blClient
  }

  async getScoreByPlayerIdAndMapId(
    playerId: string,
    mapId: string,
    option?: MapDiffOption
  ): Promise<Leaderboard> {
    const map = await this.bsClient.searchMapById(mapId)
    if (!map) {
      throw Error('error.not.found')
    }
    const hash = map.versions[0].hash
    let reqs = map.versions[0].diffs.map((it) => ({
      diff: it.difficulty,
      mode: it.characteristic,
      hash: hash,
      playerID: playerId,
      leaderboardContext: 'general',
    }))
    if (option && option.difficulty) {
      reqs = reqs.filter((item) => item.diff == option.difficulty)
    }
    if (option && option.mode) {
      reqs = reqs.filter((item) => item.mode == option.mode)
    }
    const res = await Promise.all(
      reqs.map((item) => {
        return this.blClient.getPlayerScore(item)
      })
    )
    const scores = res.filter((item) => item != null)
    // todo sort score
    if (scores.length < 1) {
      throw Error('error.not.found')
    }
    scores.sort(sortScore)
    return scores[0]
  }

  getTokenInfo(ak: string) {
    return this.blClient.getTokenInfo(ak)
  }
  refreshOAuthToken = (rk: string) => this.blClient.refreshOAuthToken(rk)

  async getPlayerScoresWithUserInfo(accountId: string, queryParams?: any) {
    const [userInfo, playerScores, pinnedScores] = await Promise.all([
      this.blClient.getPlayerInfo(accountId),
      this.blClient.getPlayerScores(accountId),
      this.blClient.getPlayerPinnedScores(accountId),
    ])
    const filteredScores = playerScores.data.filter(
      (item) => !pinnedScores.some((pinned) => pinned.id === item.id)
    )
    const scores = pinnedScores.concat(filteredScores).slice(0, 24)
    return {
      scores: scores,
      userInfo: userInfo,
    }
  }

  async getScoreAndBSMapByScoreId(scoreId: string) {
    const res = await this.blClient.getBeatScore(scoreId)
    const bsorLink = res.replay
    const bsorContent = await fetch(bsorLink)
    const bsor = await new Promise((resolve, reject) => {
      bsorContent.arrayBuffer().then((res) => decode(res, resolve))
      setTimeout(() => reject('timeout exceed'), 5000)
    })
    const statistic = await fetch(
      `https://cdn.scorestats.beatleader.xyz/${scoreId}.json`
    ).then((res) => res.json())
    const id = res.song.id.split('x')?.[0]
    const bsMap = await this.bsClient.searchMapById(id)
    return {
      score: res,
      bsMap: bsMap,
      statistic: statistic,
      bsor: bsor,
    }
  }
}
