import { createFetch, Fetch } from '@/common/fetch'
import { Logger } from '@/core'
import { AioOauthTokenResponse } from '../interfaces/aiosaber'

export class AIOSaberClient {
  f: Fetch
  constructor(logger: Logger) {
    this.f = createFetch(logger).baseUrl('https://abs.ktlab.io')
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
