import { RelateChannelInfo, Session, tran } from 'beatsaber-bot-core'

import { h, Session as KoiSession } from 'koishi'
import { ChannelInfo } from '@/types'
export class KSession implements Session<ChannelInfo> {
  // create a session Object?
  private readonly session: KoiSession
  lang: string
  mentions: number[]
  u: RelateChannelInfo<ChannelInfo>
  g: RelateChannelInfo<ChannelInfo>
  constructor(session: KoiSession, u, g) {
    this.session = session
    this.u = u
    this.g = g
    this.lang = 'zh-cn'
  }
  getSessionInfo(): ChannelInfo {
    return {
      uid: this.session.uid,
      channelId: this.session.channelId,
      selfId: this.session.selfId,
      platform: this.session.platform,
    }
  }

  async send(msg: string): Promise<void> {
    await this.session.send(msg)
  }
  async sendImgUrl(url: string): Promise<void> {
    await this.session.send(h('message', [h('img', { src: url })]))
  }
  async sendImgBuffer(content: any, mimeType?: string): Promise<void> {
    await this.session.send(h.image(content, mimeType ?? 'image/png'))
  }
  async sendQueued(msg: string): Promise<void> {
    await this.session.sendQueued(msg)
  }
  async sendAudio(url: string): Promise<void> {
    await this.session.send(h.audio(url))
  }
  async sendQuote(msg: string): Promise<void> {
    await this.session.sendQueued(msg)
  }

  text(path: string, params: object = {}): string {
    const res = tran(path, params, this.lang)
    return res ?? path
  }

  async prompt(timeout: number): Promise<string | undefined> {
    return this.session.prompt(timeout)
  }
}
