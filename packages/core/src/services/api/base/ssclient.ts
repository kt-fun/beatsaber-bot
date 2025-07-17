import {
  ScoreSaberUser,
  ScoreSaberUserResponse,
} from '../interfaces/scoresaber'
import { ScoresaberLeaderboardResp } from '../interfaces/scoresaber/leaderboard'
import { createFetch, Fetch } from '@/common/fetch'
import { Logger } from '@/core'
import {NotFoundError, RequestError} from "@/common/fetch/error";
import { SSAccountNotFoundError } from "@/services/errors";
export class ScoreSaberClient {
  f: Fetch
  constructor(logger: Logger) {
    this.f = createFetch(logger).extend({
      baseURL: 'https://scoresaber.com',
      ignoreResponseError: false,
      onResponseError: (context) => {
        // 比如 userId 输入为 普通字符串，会导致 500 error，而不是 400 bad request
        if (
          context.response.status === 500 ||
          context.response.status === 404
        ) {
          throw new NotFoundError()
        }
        throw new RequestError(context.error)
      },
    })
  }
  async getScoreUserById(userId: string) {
    return this.f.get<ScoreSaberUser>(`/api/player/${userId}/full`).catch(e => {
      if(e instanceof NotFoundError) {
        throw new SSAccountNotFoundError({ accountId: userId })
      }
      throw e
    })
  }

  async getScoreItemsById(userId: string, page: number, pageSize: number = 8) {
    return this.f.get<ScoreSaberUserResponse>(`/api/player/${userId}/scores`, {
      query: {
        sort: 'top',
        page: page,
        limit: pageSize,
      },
    }).catch(e => {
      if(e instanceof NotFoundError) {
        throw new SSAccountNotFoundError({ accountId: userId })
      }
      throw e
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
