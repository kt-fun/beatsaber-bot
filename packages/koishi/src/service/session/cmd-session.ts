import {
  RelateChannelInfo,
  Session,
  tran,
  TmpFileStorage,
} from 'beatsaber-bot-core'

import { h, Session as KoiSession } from 'koishi'
import { ChannelInfo, KoiRelateChannelInfo } from '@/types'

export class KSession implements Session<ChannelInfo> {
  // create a session Object?
  private readonly session: KoiSession
  lang: string
  mentions: RelateChannelInfo<ChannelInfo>[] = []
  u: KoiRelateChannelInfo
  g: KoiRelateChannelInfo
  tmpStorage?: TmpFileStorage | undefined
  constructor(
    session: KoiSession,
    u,
    g,
    locale,
    mentions,
    tmpStorage?: TmpFileStorage | undefined
  ) {
    this.session = session
    this.u = u
    this.g = g
    this.lang = locale
    this.mentions = mentions
    this.tmpStorage = tmpStorage
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
  async sendImgByUrl(url: string): Promise<void> {
    await this.session.send(h('message', [h('img', { src: url })]))
  }
  async sendAudioByUrl(url: string): Promise<void> {
    await this.session.send(h.audio(url))
  }

  async sendImgBuffer(content: Buffer, mimeType?: string): Promise<void> {
    if (this.tmpStorage) {
      const url = await this.tmpStorage.uploadImg(content, mimeType)
      return await this.sendImgByUrl(url)
    }
    await this.session.send(h.image(content, mimeType ?? 'image/png'))
  }
  async sendQueued(msg: string): Promise<void> {
    await this.session.sendQueued(msg)
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

// convert sessionInfo
// mentionReg = /<at\s+id="(\w+)"\/>/
// transformMention(session: KoiSession): void {
//   let content = session.content
//   const ids = []
//   let match
//   while ((match = this.mentionReg.exec(content)) !== null) {
//     ids.push(match[1])
//     content = content.replace(match[0], '')
//   }
//   //channel info to uid
//   this.mentions = ids
// }
