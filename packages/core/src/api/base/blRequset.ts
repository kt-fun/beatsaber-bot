import {
  BeadLeaderScoresResponse,
  BeatLeaderPlayerScoreRequest,
  Leaderboard,
  Score,
  BeatLeaderUser,
} from '../interfaces/beatleader'
import { Config } from '@/config'
import { OAuthTokenInfoResponse, OAuthTokenResponse } from './bsRequest'
const get = <T>(...args) => fetch(args as any).then((res) => res.json() as T)
export const blRequest = (cfg: Config) => {
  let host = 'https://api.beatleader.xyz'
  if (host.endsWith('/')) {
    host = host.substring(0, host.length - 1)
  }

  const url = (path: string) => {
    if (!path.startsWith('/')) {
      path = '/' + path
    }
    return host + path
  }
  const getPlayerScore = async (req: BeatLeaderPlayerScoreRequest) => {
    const res = await get<Leaderboard>(
      url(
        `/score/${req.leaderboardContext}/${req.playerID}/${req.hash}/${req.diff}/${req.mode}`
      )
    )
    return res
  }

  const getTokenInfo = async (accessToken: string) => {
    return get<OAuthTokenInfoResponse>(url(`/oauth2/identity`), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  }

  const refreshOAuthToken = async (refreshToken: string) => {
    const form = new URLSearchParams()
    form.append('client_id', cfg.blOauthClientId)
    form.append('client_secret', cfg.blOauthClientSecret)
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

  const getPlayerInfo = async (accountId: string) => {
    return get<BeatLeaderUser>(url(`/player/${accountId}`))
  }

  const getPlayerScores = async (accountId: string) => {
    return get<BeadLeaderScoresResponse>(
      url(`/player/${accountId}/scores?count=24&sortBy=pp`)
    )
  }
  const getPlayerPinnedScores = async (accountId: string) => {
    return get<Score[]>(url(`/player/${accountId}/pinnedScores`))
  }

  const getBeatScore = async (scoreId: string) => {
    return get<Score>(url(`/score/${scoreId}`))
  }

  return {
    getPlayerScore,
    getPlayerScores,
    getPlayerInfo,
    getPlayerPinnedScores,
    getTokenInfo,
    refreshOAuthToken,
    getBeatScore,
  }
}
