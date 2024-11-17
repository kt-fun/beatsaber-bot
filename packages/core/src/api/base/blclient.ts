import { OAuthTokenInfoResponse, OAuthTokenResponse } from '../interfaces'
import { Config } from '@/config'
import { createFetch, Fetch } from '@/utils/fetch'
import {
  BeadLeaderScoresResponse,
  BeatLeaderPlayerScoreRequest,
  BeatLeaderUser,
  Leaderboard,
  Score,
} from '@/api/interfaces/beatleader'
import { Logger } from '@/interface'

export class BeatLeaderClient {
  cfg: Config
  f: Fetch
  constructor(cfg: Config, logger: Logger) {
    this.f = createFetch(logger).baseUrl('https://api.beatleader.xyz').extend({
      ignoreResponseError: false,
    })
    this.cfg = cfg
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
    const form = new URLSearchParams()
    form.append('client_id', this.cfg.blOauthClientId)
    form.append('client_secret', this.cfg.blOauthClientSecret)
    form.append('grant_type', 'refresh_token')
    form.append('refresh_token', refreshToken)
    const res = await fetch('https://beatsaver.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: form,
    }).then((res) => res.json() as Promise<OAuthTokenResponse>)
    if (!res.access_token) {
      throw new Error('refreshToken failed')
    }
    return res
  }

  async getPlayerInfo(accountId: string) {
    return this.f.get<BeatLeaderUser>(`/player/${accountId}`)
  }

  async getPlayerScores(accountId: string) {
    return this.f.get<BeadLeaderScoresResponse>(
      `/player/${accountId}/scores?count=24&sortBy=pp`
    )
  }
  async getPlayerPinnedScores(accountId: string) {
    return this.f.get<Score[]>(`/player/${accountId}/pinnedScores`)
  }

  async getBeatScore(scoreId: string) {
    return this.f.get<Score>(`/score/${scoreId}`)
  }

  async getLeaderboard(leaderboardId: string, params?: Record<string, any>) {
    return this.f.get(`/leaderboard/${leaderboardId}`, { query: params })
  }
}
