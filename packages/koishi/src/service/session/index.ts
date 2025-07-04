import { ChannelInfo } from '@/types'
import { Bot, Context } from 'koishi'
import { KoishiSession } from './schedule-session'
import { BotService, Config } from 'beatsaber-bot-core'
import { S3Service } from 'beatsaber-bot-core/infra/s3'
import {I18nService} from "beatsaber-bot-core/infra";
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
  config: Config
  i18n?: I18nService
  s3?: S3Service
  constructor(ctx: Context, config: Config) {
    this.ctx = ctx
    this.config = config
    if (config.s3?.enabled) {
      this.s3 = new S3Service(config.s3)
    }
  }
  getSessionByChannelInfo(channelInfo: ChannelInfo): KoishiSession {
    const bot = this.ctx.bots[`${channelInfo.platform}:${channelInfo.selfId}`]
    if (bot) {
      return new KoishiSession(bot, channelInfo, this.i18n, this.s3)
    }
    return undefined
  }
}
