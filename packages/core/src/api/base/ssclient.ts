import { Config } from '@/config'
import { createFetch, Fetch } from '@/utils/fetch'
import {
  ScoreSaberUser,
  ScoreSaberUserResponse,
} from '@/api/interfaces/scoresaber'
import { ScoresaberLeaderboardResp } from '@/api/interfaces/scoresaber/leaderboard'
import { Logger } from '@/interface'
import { NotFoundError } from '@/utils/fetch/error'

export class ScoreSaberClient {
  cfg: Config
  f: Fetch
  constructor(cfg: Config, logger: Logger) {
    this.f = createFetch(logger).extend({
      baseURL: 'https://scoresaber.com',
      ignoreResponseError: false,
      onResponseError: (context) => {
        if (
          context.response.status === 500 ||
          context.response.status === 404
        ) {
          throw new NotFoundError()
        }
      },
    })
    this.cfg = cfg
  }
  async getScoreUserById(userId: string) {
    return this.f.get<ScoreSaberUser>(`/api/player/${userId}/full`)
  }

  async getScoreItemsById(userId: string, page: number, pageSize: number = 8) {
    return this.f.get<ScoreSaberUserResponse>(`/api/player/${userId}/scores`, {
      query: {
        sort: 'top',
        page: page,
        limit: pageSize,
      },
    })
  }
  async getScoreItemsByMapId(
    mapId: string,
    diff: string,
    mode: string,
    page: number,
    pageSize: number = 8
  ): Promise<ScoresaberLeaderboardResp> {
    const id = convertToLeaderboardId(mapId, diff, mode)
    return this.f.get(`/api/leaderboard/by-id/${id}/scores`, {
      query: {
        page: page,
        limit: pageSize,
      },
    })
  }
}

const convertToLeaderboardId = (mapid: string, diff: string, mode: string) => {
  return mapid
}
