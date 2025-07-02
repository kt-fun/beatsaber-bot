import {
  RelateChannelInfo,
  Session,
} from 'beatsaber-bot-core'
import { ChannelInfo } from '@/types'
import { Bot, h } from 'koishi'
import { I18nService, S3Service } from "beatsaber-bot-core/infra";
export class KoishiSession implements Session<ChannelInfo> {
  bot: Bot
  channelInfo: ChannelInfo
  mentions: RelateChannelInfo<ChannelInfo>[] = []
  g: RelateChannelInfo<ChannelInfo>
  u: RelateChannelInfo<ChannelInfo>
  lang: string
  s3?: S3Service
  i18n?: I18nService
  constructor(
    bot: Bot,
    channelInfo: ChannelInfo,
    i18n?: I18nService,
    s3?: S3Service
  ) {
    this.lang = 'zh-cn'
    this.bot = bot
    // this.uid = channelInfo.uid
    this.channelInfo = channelInfo
    this.s3 = s3
    this.i18n = i18n
  }

  async sendImgByUrl(url: string): Promise<void> {
    await this.bot.sendMessage(
      this.channelInfo.channelId,
      h('message', [h('img', { src: url })])
    )
  }
  async sendAudioByUrl(url: string): Promise<void> {
    await this.bot.sendMessage(this.channelInfo.channelId, h.audio(url))
  }

  async sendImgBuffer(content: Buffer, mimeType?: string): Promise<void> {
    if (this.s3) {
      const url = await this.s3.uploadImg(content, mimeType)
      return await this.sendImgByUrl(url)
    }
    await this.bot.sendMessage(
      this.channelInfo.channelId,
      h.image(content, mimeType ?? 'image/png')
    )
  }
  getSessionInfo(): ChannelInfo {
    return this.channelInfo
  }

  async send(msg: string): Promise<void> {
    await this.bot.sendMessage(this.channelInfo.channelId, msg)
  }

  async sendQueued(msg: string): Promise<void> {
    await this.bot.sendMessage(this.channelInfo.channelId, msg)
  }

  async sendQuote(msg: string): Promise<void> {
    await this.bot.sendMessage(this.channelInfo.channelId, msg)
  }

  text(path: string, params: object = {}): string {
    try {
      return this.i18n?.tran(path, params, this.lang) ?? path
    }catch (e) {
      console.log("i18n tran error", e)
      return path
    }
  }

  async prompt(timeout: number): Promise<string | undefined> {
    throw new Error('prompt not implemented')
  }
}
