import { h, Session } from 'koishi'

declare module 'koishi' {
  interface Session {
    sendQuote(text: string): Promise<string[]>
  }
}

Session.prototype.sendQuote = async function (text: string) {
  return this.sendQueued(h('message', h('quote', { id: this.messageId }), text))
}
