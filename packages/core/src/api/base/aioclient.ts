import { Config } from '@/config'
import { AioOauthTokenResponse } from '@/api/interfaces/aiosaber'
import { Fetch } from '@/utils/fetch/ofetch'
import ofetch from '@/utils/fetch'
import { Logger } from '@/interface'
import { RequestError } from '@/errors'

export class AIOSaberClient {
  cfg: Config
  f: Fetch
  constructor(cfg: Config, logger: Logger) {
    this.f = ofetch.extend({
      baseURL: 'https://abs.ktlab.io',
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
  async getBSOAuthToken(key: string) {
    return this.f.get<AioOauthTokenResponse>(
      `/api/oauth/beatsaver/token/${key}`
    )
  }
  async getBLOAuthToken(key: string) {
    return this.f.get<AioOauthTokenResponse>(
      `/api/oauth/beatleader/token/${key}`
    )
  }
}
