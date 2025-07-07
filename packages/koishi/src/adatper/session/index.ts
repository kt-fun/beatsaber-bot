import { Bot, Context } from 'koishi'
import { KoishiSession } from './schedule-session'
import {Config, I18nService, AgentService, S3Service, Channel} from "beatsaber-bot-core";
import {AgentHolder} from "@/adatper/agent";
declare module 'koishi' {
  interface Context {
    bots: Bot[]
  }
}

export * from './schedule-session'
export * from './cmd-session'

export class KoishiBotService
  implements AgentService
{
  ctx: Context
  config: Config
  i18n?: I18nService
  s3?: S3Service
  agentHolder: AgentHolder
  constructor(ctx: Context, agentHolder: AgentHolder, config: Config) {
    this.ctx = ctx
    this.config = config
    this.agentHolder = agentHolder
    if (config.s3?.enabled) {
      this.s3 = new S3Service(config.s3)
    }
  }
  getAgentSessionByChannelInfo(channel: Channel): KoishiSession {
    const {agent, channelInfo} = this.agentHolder.getAgentByChannel(channel)
    if (agent) {
      return new KoishiSession(agent, channelInfo, this.i18n, this.s3)
    }
    return undefined
  }
}
