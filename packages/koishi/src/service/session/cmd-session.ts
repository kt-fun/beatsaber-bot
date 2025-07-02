import {
  RelateChannelInfo,
  Session,
} from 'beatsaber-bot-core'
import { S3Service } from 'beatsaber-bot-core/infra/s3'
import { tran } from 'beatsaber-bot-core/infra'
import { h, Session as KoiSession } from 'koishi'
import { ChannelInfo, KoiRelateChannelInfo } from '@/types'

export class KSession implements Session<ChannelInfo> {
  private readonly session: KoiSession
  lang: string
  mentions: RelateChannelInfo<ChannelInfo>[] = []
  u: KoiRelateChannelInfo
  g: KoiRelateChannelInfo
  s3?: S3Service | undefined
  constructor(
    session: KoiSession,
    u,
    g,
    locale,
    mentions,
    s3?: S3Service | undefined
  ) {
    this.session = session
    this.u = u
    this.g = g
    this.lang = locale
    this.mentions = mentions
    this.s3 = s3
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
    if (this.s3) {
      const url = await this.s3.uploadImg(content, mimeType)
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
    const res = await this.session.prompt(timeout)
    return tryToTransform(res)
  }
}

const regex = /src="(https?:[^"]+)"/
const tryToTransform = (t: string | undefined) => {
  if (!t) return undefined
  if (typeof t == 'string' && regex.test(t)) {
    const [, src] = regex.exec(t)
    const res = src?.replaceAll('&amp;', '&')
    return res
  }
  return t
}
