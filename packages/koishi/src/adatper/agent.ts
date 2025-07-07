import { Channel } from "beatsaber-bot-core"
import {$, Context, Session} from "koishi";

export class AgentHolder {
  private channel2Agent: Channel2Agent[] = []
  ctx: Context
  constructor(ctx: Context) {
    this.ctx = ctx
  }
  private called: boolean
  private cnt = 0
  async init() {
    if(this.called) return
    this.called = true
    try {
      const bots = this.ctx.bots
      for (const bot of bots) {
        const agent = {
          agentId: bot.selfId,
          providerId: bot.platform,
        }
        const agentChannels = []
        const guilds = await bot.getGuildList()
        for (const guild of guilds.data) {
          const channels = await bot.getChannelList(guild.id)
          const channelIds = channels.data.map(it => it.id)
          const bsChannels = await this.ctx.database
            .select('BSChannel', (c) => $.and($.eq(c.providerId, bot.platform), $.in(c.channelId, channelIds)))
            .execute()
          agentChannels.push(...bsChannels)
        }
        this.channel2Agent.push({ agent, channels: agentChannels })
      }
      this.ctx.logger.info(`AgentHolder initialized successfully, load ${bots.length} bots`)
    }catch (e) {
      this.called = false
      if(this.cnt > 3) {
        return this.ctx.logger.error("failed to load bots")
      }
      await this.init()
      this.cnt++
    }
  }
  registerAgentAndChannel(session: Session, channel: Channel) {
    const agent = {
      agentId: session.selfId,
      providerId: `koishi:${session.platform}`,
    }
    const agents = this.channel2Agent.find(it => it.agent.agentId === agent.agentId && it.agent.providerId == agent.providerId)
    if(agents) {
      const c = agents.channels.find(c => c.id === channel.id)
      if(!c) agents.channels.push(channel)
    }else {
      this.channel2Agent.push({
        agent,
        channels: [channel],
      })
    }
  }
  #getAgentByChannel(channel: Channel) {
    const agent = this.channel2Agent.find(it => it.channels.filter(c => channel.id == c.id).length > 0)
    return agent
  }
  getAgentByChannel(channel: Channel) {
    const agent2Agent = this.#getAgentByChannel(channel)
    let channelInfo
    let ch = agent2Agent?.channels.find(it => it.id === channel.id)
    if(ch) {
      channelInfo = {
        channelId: ch.channelId,
        platform: ch.providerId,
      }
    }
    // registerAgentAndChannel
    // Cannot access 'channel' before initialization
    const agent = this.ctx.bots.find(it => it.selfId == agent.agent.agentId)
    return {
      agent: agent,
      channelInfo
    }
  }
}
type Channel2Agent =   {
  agent: {
    agentId: string
    providerId: string
  },
  channels: Channel[],
}
