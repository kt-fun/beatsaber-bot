import { createFetch, Fetch } from '@/infra/support/fetch'
import {
  ScoreSaberUser,
  ScoreSaberUserResponse,
} from '../interfaces/scoresaber'
import { ScoresaberLeaderboardResp } from '../interfaces/scoresaber/leaderboard'
import { Logger } from '@/interface'
import { NotFoundError } from '@/infra/support/fetch/error'

export class ScoreSaberClient {
  f: Fetch
  constructor(logger: Logger) {
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
