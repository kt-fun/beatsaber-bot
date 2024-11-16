import { ScheduleTaskCtx } from './interface'

export const tokenRefreshTask = async <T>(c: ScheduleTaskCtx<T>) => {
  c.logger.info('start token refresh task')
  // getAllOauthToken
  const accounts = []
  // await db.getAllOAuthTokenNeedRefresh()
  // const accounts = await ctx.database.get('BSRelateOAuthAccount', {
  //   valid: 'valid',
  //   type: 'oauth',
  // })
  for (const account of accounts) {
    c.logger.info(
      `try to refresh ${account.platform} ${account.platformUid}'s token`
    )
    const now = new Date()
    if (account.platform === 'beatleader') {
      const token = await c.api.BeatLeader.refreshOAuthToken(
        account.refreshToken
      )
      if (!token) {
        c.logger.info(
          `failed to refresh ${account.platform} token, invalid this account, ${JSON.stringify(account)}`
        )
        account.valid = 'invalid'
        account.lastModifiedAt = now
        // await ctx.database.upsert('BSRelateOAuthAccount', [account])
        // get subscribe info and notify renew
        // bot.sendMessage(item.sub.channelId, '似乎 BeatSaver 通知的 token 已经失效了，通过 bbbind 重新绑定吧')
        continue
      }
      account.accessToken = token.access_token
      account.refreshToken = token.refresh_token
    } else if (account.platform === 'beatsaver') {
      const token = await c.api.BeatSaver.refreshOAuthToken(
        account.refreshToken
      )
      if (!token) {
        c.logger.info(
          `failed to refresh ${account.platform} token, invalid this account, ${JSON.stringify(account)}`
        )
        account.valid = 'invalid'
        account.lastModifiedAt = now
        // await ctx.database.upsert('BSRelateOAuthAccount', [account])
        // get subscribe info and notify renew
        // bot.sendMessage(item.sub.channelId, '似乎 BeatSaver 通知的 token 已经失效了，通过 bbbind 重新绑定吧')
        continue
      }
      account.accessToken = token.access_token
      account.refreshToken = token.refresh_token
    }
    account.lastRefreshAt = now
    account.lastModifiedAt = now
    //
    // await ctx.database.upsert('BSRelateOAuthAccount', [account])
    c.logger.info(
      `refresh ${account.platform} token successfully ${account.platformUid}`
    )
  }
  c.logger.info(`token refresh task finished`)
}
