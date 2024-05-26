import { Context, Logger } from 'koishi'
import { Config } from '../config'
import { APIService } from '../service'

const tokenRefreshTask =
  (ctx: Context, config: Config, api: APIService, logger: Logger) =>
  async () => {
    logger.info('start token refresh task')

    const accounts = await ctx.database.get('BSRelateOAuthAccount', {
      valid: 'valid',
      type: 'oauth',
    })
    for (const account of accounts) {
      logger.info(
        `try to refresh ${account.platform} ${account.platformUid}'s token`
      )
      const now = new Date()
      if (account.platform === 'beatleader') {
        const token = await api.BeatLeader.wrapperResult().refreshOAuthToken(
          account.refreshToken
        )
        if (!token.isSuccess()) {
          logger.info(
            `failed to refresh ${account.platform} token, invalid this account, ${JSON.stringify(account)}`
          )
          account.valid = 'invalid'
          account.lastModifiedAt = now
          await ctx.database.upsert('BSRelateOAuthAccount', [account])
          // get subscribe info and notify renew
          // bot.sendMessage(item.sub.channelId, '似乎 BeatSaver 通知的 token 已经失效了，通过 bbbind 重新绑定吧')
          continue
        }
        account.accessToken = token.data.access_token
        account.refreshToken = token.data.refresh_token
      } else if (account.platform === 'beatsaver') {
        const token = await api.BeatSaver.wrapperResult().refreshOAuthToken(
          account.refreshToken
        )
        if (!token.isSuccess()) {
          logger.info(
            `failed to refresh ${account.platform} token, invalid this account, ${JSON.stringify(account)}`
          )
          account.valid = 'invalid'
          account.lastModifiedAt = now
          await ctx.database.upsert('BSRelateOAuthAccount', [account])
          // get subscribe info and notify renew
          // bot.sendMessage(item.sub.channelId, '似乎 BeatSaver 通知的 token 已经失效了，通过 bbbind 重新绑定吧')
          continue
        }
        account.accessToken = token.data.access_token
        account.refreshToken = token.data.refresh_token
      }
      account.lastRefreshAt = now
      account.lastModifiedAt = now
      await ctx.database.upsert('BSRelateOAuthAccount', [account])
      logger.info(
        `refresh ${account.platform} token successfully ${account.platformUid}`
      )
    }
    logger.info(`token refresh task finished`)
  }

export default tokenRefreshTask
