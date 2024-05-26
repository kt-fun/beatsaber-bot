import { Context } from 'koishi'
import { Config } from '../../../config'
import { AioOauthTokenResponse } from '../interfaces/aiosaber'

export const aioRequest = (ctx: Context, cfg: Config) => {
  const http = ctx.http
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
    http.get<AioOauthTokenResponse>(url(`/api/oauth/beatsaver/token/${key}`))
  const getBLOAuthToken = async (key: string) =>
    http.get<AioOauthTokenResponse>(url(`/api/oauth/beatleader/token/${key}`))
  return {
    getBSOAuthToken,
    getBLOAuthToken,
  }
}
