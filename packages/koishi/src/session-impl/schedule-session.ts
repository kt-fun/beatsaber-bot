import { RelateChannelInfo, Session, tran } from 'beatsaber-bot-core'
import { ChannelInfo } from '@/types'
import { Bot, h } from 'koishi'

export class KoishiSession implements Session<ChannelInfo> {
  bot: Bot
  channelInfo: ChannelInfo
  mentions: RelateChannelInfo<ChannelInfo>[] = []
  g: RelateChannelInfo<ChannelInfo>
  u: RelateChannelInfo<ChannelInfo>
  lang: string
  constructor(bot: Bot, channelInfo: ChannelInfo) {
    this.lang = 'zh-cn'
    this.bot = bot
    // @ts-ignore
    this.uid = channelInfo.uid
    this.channelInfo = channelInfo
  }

  async sendImgUrl(url: string): Promise<void> {
    await this.bot.sendMessage(
      this.channelInfo.channelId,
      h('message', [h('img', { src: url })])
    )
  }
  async sendImgBuffer(content: any, mimeType?: string): Promise<void> {
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
    const res = tran(path, params, 'zh-cn')
    return res ?? path
  }

  async sendAudio(url: string): Promise<void> {
    await this.bot.sendMessage(this.channelInfo.channelId, h.audio(url))
  }

  async prompt(timeout: number): Promise<string | undefined> {
    return Promise.reject(new Error('prompt not implemented'))
  }
}
