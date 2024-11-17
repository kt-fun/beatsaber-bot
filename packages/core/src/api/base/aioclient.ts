import { Config } from '@/config'
import { AioOauthTokenResponse } from '@/api/interfaces/aiosaber'
import { Fetch } from '@/utils/fetch/ofetch'
import { createFetch } from '@/utils/fetch'
import { Logger } from '@/interface'

export class AIOSaberClient {
  cfg: Config
  f: Fetch
  constructor(cfg: Config, logger: Logger) {
    this.f = createFetch(logger).baseUrl('https://abs.ktlab.io')
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
