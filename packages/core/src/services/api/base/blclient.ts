import { OAuthTokenInfoResponse, OAuthTokenResponse } from '../interfaces'
import { createFetch, Fetch } from '@/common/fetch'
import { Logger } from '@/core'
import {
  BeadLeaderScoresResponse,
  BeatLeaderPlayerScoreRequest,
  BeatLeaderUser,
  Leaderboard,
  Score,
} from '../interfaces/beatleader'
import {BLAccountNotFoundError, SSAccountNotFoundError} from "@/services/errors";
import { NotFoundError } from "@/common/fetch/error";

type ClientOptions = {
  client_id?: string
  client_secret?: string
  logger?: Logger
}

export class BeatLeaderClient {
  f: Fetch
  opt?: ClientOptions
  constructor(opt?: ClientOptions) {
    this.f = createFetch(opt?.logger).baseUrl('https://api.beatleader.xyz').extend({
      ignoreResponseError: false,
    })
  }
  async getPlayerScore(req: BeatLeaderPlayerScoreRequest) {
    const res = await this.f.get<Leaderboard>(
      `/score/${req.leaderboardContext}/${req.playerID}/${req.hash}/${req.diff}/${req.mode}`
    )
    return res
  }

  async getTokenInfo(accessToken: string) {
    return this.f.get<OAuthTokenInfoResponse>(`/oauth2/identity`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  }

  async refreshOAuthToken(refreshToken: string) {
    return this.f.post<OAuthTokenResponse>(
      'https://beatsaver.com/api/oauth2/token',
      {
        form: {
          client_id: this.opt.client_id,
          client_secret: this.opt.client_secret,
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        },
      }
    )
  }

  async getPlayerInfo(accountId: string) {
    return this.f.get<BeatLeaderUser>(`/player/${accountId}`).catch(e => {
      if(e instanceof NotFoundError) throw new BLAccountNotFoundError({ accountId: accountId })
      throw e
    })
  }

  async getPlayerScores(accountId: string) {
    return this.f.get<BeadLeaderScoresResponse>(
      `/player/${accountId}/scores?count=24&sortBy=pp`
    ).catch(e => {
      if(e instanceof NotFoundError) {
        throw new BLAccountNotFoundError({ accountId })
      }
      throw e
    })
  }
  async getPlayerPinnedScores(accountId: string) {
    return this.f.get<Score[]>(`/player/${accountId}/pinnedScores`).catch(e => {
      if(e instanceof NotFoundError) {
        throw new BLAccountNotFoundError({ accountId })
      }
      throw e
    })
  }

  async getBeatScore(scoreId: string) {
    return this.f.get<Score>(`/score/${scoreId}`)
  }

  async getLeaderboard(leaderboardId: string, params?: Record<string, any>) {
    return this.f.get(`/leaderboard/${leaderboardId}`, { query: params })
  }
}
