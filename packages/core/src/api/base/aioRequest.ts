import { AioOauthTokenResponse } from '../interfaces/aiosaber'
import { Config } from '@/config'

const get = <T>(...args) => fetch(args as any).then((res) => res.json() as T)

export const aioRequest = (cfg: Config) => {
  let host = 'https://aiobs.ktlab.io'
  if (host.endsWith('/')) {
    host = host.substring(0, host.length - 1)
  }
  const url = (path: string) => {
    if (!path.startsWith('/')) {
      path = '/' + path
    }
    return host + path
  }
  const getBSOAuthToken = async (key: string) =>
    get<AioOauthTokenResponse>(url(`/api/oauth/beatsaver/token/${key}`))
  const getBLOAuthToken = async (key: string) =>
    get<AioOauthTokenResponse>(url(`/api/oauth/beatleader/token/${key}`))
  return {
    getBSOAuthToken,
    getBLOAuthToken,
  }
}
