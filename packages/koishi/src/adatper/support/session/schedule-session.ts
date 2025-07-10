import {
  Channel,
  SessionAgent,
  PositiveSession,
  I18nService,
  S3Service
} from 'beatsaber-bot-core'
import {ChannelInfo} from "./type";
import {Bot , h} from 'koishi'

export class KoishiSession implements PositiveSession {
  bot: Bot
  channelInfo: ChannelInfo
  channel: Channel
  agent: SessionAgent
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
