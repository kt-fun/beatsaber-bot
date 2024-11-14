import { OAuthTokenInfoResponse, OAuthTokenResponse } from '../interfaces'
import { Config } from '@/config'
import ofetch from '@/utils/fetch'
import { Fetch } from '@/utils/fetch/ofetch'
import {
  BSMap,
  BSMapLatestResponse,
  BSUserResponse,
  HashReqResponse,
} from '@/api/interfaces/beatsaver'
import { Logger } from '@/interface'
import { RequestError } from '@/errors'

export class BeatSaverClient {
  cfg: Config
  f: Fetch
  constructor(cfg: Config, logger: Logger) {
    this.f = ofetch.extend({
      baseURL: cfg.beatSaverHost ?? 'https://api.beatsaver.com',
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
  async getBSMapperById(userId: string) {
    return this.f.get<BSUserResponse>(`/users/id/${userId}`)
  }

  async getLatestMaps(pageSize: number = 5) {
    return this.f
      .get<BSMapLatestResponse>(`/maps/latest`, {
        query: {
          sort: 'FIRST_PUBLISHED',
          pageSize,
        },
      })
      .then((res) => res.docs)
  }

  async searchMapByKeyword(
    key: string,
    params?: Record<string, boolean | number | string>
  ) {
    return this.f
      .get<BSMapLatestResponse>(`/search/text/0`, {
        query: {
          q: key,
          ...params,
        },
      })
      .then((res) => res.docs)
  }

  async searchMapById(id: string) {
    return this.f.get<BSMap>(`/maps/id/${id}`)
  }
  async getTokenInfo(ak: string) {
    return this.f.get<OAuthTokenInfoResponse>(`/oauth2/identity`, {
      headers: {
        Authorization: `Bearer ${ak}`,
      },
    })
  }

  async getMapsByHashes(hashes: string[]) {
    return this.f.get<HashReqResponse>(`/maps/hash/${hashes.join(',')}`)
  }

  async refreshOAuthToken(rk: string) {
    const res = await this.f.post<OAuthTokenResponse>(
      'https://beatsaver.com/api/oauth2/token',
      {
        form: {
          client_id: this.cfg.bsOauthClientId,
          client_secret: this.cfg.bsOauthClientSecret,
          grant_type: 'refresh_token',
          refresh_token: rk,
        },
      }
    )
    if (!res.access_token) {
      throw new Error('refreshToken failed')
    }
    return res
  }
}
