import { RelateChannelInfo } from '@/db'

type ChannelInfo = any

// now it's only for initiative message
export interface BotService<T extends ChannelInfo, S extends Session<T>> {
  getSessionByChannelInfo(channelInfo: T): S
}

export interface Session<T extends any = any> {
  u: RelateChannelInfo<T>
  g: RelateChannelInfo<T>
  mentions: (RelateChannelInfo<T> | undefined)[]
  getSessionInfo(): T
  sendImgBuffer(content: any, mimeType?: string): Promise<void>
  sendImgUrl(url: string): Promise<void>
  send(msg: string): Promise<void>
  sendQueued(msg: string): Promise<void>
  sendAudio(url: string): Promise<void>
  sendQuote(msg: string): Promise<void>
  text(path: string, args?): string
  prompt(timeout?: number): Promise<string | undefined>
}
