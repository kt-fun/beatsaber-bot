import {User, Account, SessionAgent, Channel} from "./domain";

type Message = string


// 被动session
export interface ISession {
  // 被动 Session，对方有用户
  sendImgBuffer(content: any, mimeType?: string): Promise<void>
  sendImgByUrl(url: string): Promise<void>
  sendAudioByUrl(url: string): Promise<void>
  send(msg: Message): Promise<void>
  sendQueued(msg: Message): Promise<void>
  sendQuote(msg: Message): Promise<void>
  text(path: string, args?): Message
  prompt(timeout?: number): Promise<Message | undefined>
}

export interface PassiveSession extends ISession {
  user: User
  channel: Channel
  mentions: User[]
  agent: SessionAgent
}


export interface AgentService {
  getAgentSessionByChannelInfo(channel: Channel): PositiveSession
}

export interface PositiveSession extends ISession {
  channel: Channel
  agent: SessionAgent
}
// 例如定时任务。或者监控数据的产生的事件。

// NotificationAgent
//


// 主动Session
