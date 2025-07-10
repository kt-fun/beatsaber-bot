import { Channel } from "beatsaber-bot-core"
import {$, Context, Session} from "koishi";

export class AgentHolder {
  ctx: Context
  constructor(ctx: Context) {
    this.ctx = ctx
  }

  async registerAgentAndChannel(session: Session, channel: Channel) {
    const agent = {
      agentId: session.bot.sid,
      providerId: `koishi:${session.platform}`,
    }
    const [row] =await this.ctx.database.select('BSChannel2Agent', (agent) => $.eq(agent.channelId, channel.id)).execute()
    const record = { channelId: channel.id, agents: [agent] }
    if(row) {
      row.agents = [...(row?.agents ?? []), record]
      await this.ctx.database.upsert('BSChannel2Agent', [row])
    }else {
      await this.ctx.database.create('BSChannel2Agent', {
        channelId: channel.id,
        agents: [agent]
      })
    }
  }
  async #getAgentByChannel(channel: Channel) {
    const [agent2channel] = await this.ctx.database.select('BSChannel2Agent', (agent) => $.eq(agent.channelId, channel.id)).execute()
    if(!agent2channel) {
      return []
    }
    return agent2channel.agents as Agent[]
  }
  async getAgentByChannel(channel: Channel) {
    const agents = await this.#getAgentByChannel(channel)
    let channelInfo = {
      channelId: channel.channelId,
      platform: channel.providerId,
    }
    let bot
    for(const agent of agents) {
      // koishi status 1 = Status.ONLINE
      bot = this.ctx.bots.find(b => b.sid === agent.agentId && b.status === 1)
      if(bot) {
        break
      }
    }
    return {
      agent: bot,
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

type Agent = {
  agentId: string
  providerId: string
}
