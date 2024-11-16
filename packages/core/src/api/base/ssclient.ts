import { Config } from '@/config'
import { Fetch } from '@/utils/fetch/ofetch'
import ofetch from '@/utils/fetch'
import {
  ScoreSaberUser,
  ScoreSaberUserResponse,
} from '@/api/interfaces/scoresaber'
import { ScoresaberLeaderboardResp } from '@/api/interfaces/scoresaber/leaderboard'
import { Logger } from '@/interface'
import { RequestError } from '@/errors'

export class ScoreSaberClient {
  cfg: Config
  f: Fetch
  constructor(cfg: Config, logger: Logger) {
    this.f = ofetch.extend({
      baseURL: 'https://scoresaber.com',
      retry: 3,
      onRequestError: ({ error, request, response }) => {
        if (response.status === 404) {
          return null
        }
        logger.error(`external request ${request} fail: ${error}`)
        throw new RequestError(error)
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
