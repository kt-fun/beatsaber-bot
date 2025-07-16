import { OAuthTokenInfoResponse, OAuthTokenResponse } from '../interfaces'
import { createFetch, Fetch } from '@/common/fetch'
import { Logger } from '@/core'

import {
  BSMap,
  BSMapLatestResponse,
  BSUserResponse,
  HashReqResponse,
} from '../interfaces/beatsaver'
import {NotFoundError} from "@/common/fetch/error";

type ClientOptions = {
  logger?: Logger,
  host?: string,
  client_id?: string,
  client_secret?: string
  f?: Fetch
}

export class BeatSaverClient {
  f: Fetch
  opt?: ClientOptions
  constructor(opt?: ClientOptions) {
    this.opt = opt
    this.f = opt.f || createFetch(opt.logger)
      .baseUrl(opt.host ?? 'https://api.beatsaver.com')
      .extend({
        ignoreResponseError: false,
        onResponseError: (context) => {
          if (
            context.response.status === 404 ||
            context.response.status === 400
          ) {
            throw new NotFoundError()
          }
        },
      })
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
    return this.f.post<OAuthTokenResponse>(
      '/oauth2/token',
      {
        form: {
          client_id: this.opt.client_id,
          client_secret: this.opt.client_secret,
          grant_type: 'refresh_token',
          refresh_token: rk,
        },
      }
    )
  }
}
