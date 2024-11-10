import { Config } from '@/config'
import { AioOauthTokenResponse } from '@/api/interfaces/aiosaber'
import { Fetch } from '@/utils/fetch/ofetch'
import ofetch from '@/utils/fetch'

export class AIOSaberClient {
  cfg: Config
  f: Fetch
  constructor(cfg: Config) {
    this.f = ofetch.extend({
      baseURL: 'https://abs.ktlab.io',
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
