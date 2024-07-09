import { ChannelInfo } from '@/types'
import { Bot, Context } from 'koishi'
import { KoishiSession } from './schedule-session'
import { BotService } from 'beatsaber-bot-core'

declare module 'koishi' {
  interface Context {
    bots: Bot[]
  }
}

export * from './schedule-session'
export * from './cmd-session'

export class KoishiBotService
  implements BotService<ChannelInfo, KoishiSession>
{
  ctx: Context
  constructor(ctx: Context) {
    this.ctx = ctx
  }
  getSessionByChannelInfo(channelInfo: ChannelInfo): KoishiSession {
    const bot = this.ctx.bots[`${channelInfo.platform}:${channelInfo.selfId}`]
    if (bot) {
      return new KoishiSession(bot, channelInfo)
    }
    return undefined
  }
}
