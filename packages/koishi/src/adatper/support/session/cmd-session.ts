import {
  PassiveSession,
  User,
  Channel,
  SessionAgent,
  S3Service,
  I18nService
} from 'beatsaber-bot-core'
import { h, Session as KoiSession } from 'koishi'

export class KSession implements PassiveSession {
  private readonly koishiAgent: KoiSession
  user: User
  channel: Channel
  mentions: User[] = []
  agent: SessionAgent
  lang: string
  s3?: S3Service
  i18n?: I18nService
  constructor(
    session: KoiSession,
    user: User,
    channel: Channel,
    mentions: User[],
    locale: string,
    i18n?: I18nService,
    s3?: S3Service
  ) {
    this.koishiAgent = session
    this.user = user
    this.channel = channel
    this.lang = locale
    this.mentions = mentions
    this.s3 = s3
    this.i18n = i18n
  }

  async send(msg: string): Promise<void> {
    await this.koishiAgent.send(msg)
  }

  async sendImgByUrl(url: string): Promise<void> {
    await this.koishiAgent.send(h('message', [h('img', { src: url })]))
  }

  async sendAudioByUrl(url: string): Promise<void> {
    await this.koishiAgent.send(h.audio(url))
  }

  async sendImgBuffer(content: Buffer, mimeType?: string): Promise<void> {
    if (this.s3) {
      const url = await this.s3.uploadImg(content, mimeType)
      return await this.sendImgByUrl(url)
    }
    await this.koishiAgent.send(h.image(content, mimeType ?? 'image/png'))
  }
  async sendQueued(msg: string): Promise<void> {
    await this.koishiAgent.sendQueued(msg)
  }

  async sendQuote(msg: string): Promise<void> {
    await this.koishiAgent.sendQueued(msg)
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
    const res = await this.koishiAgent.prompt(timeout)
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
