export type User = {
  id: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// 比如同一个channel 中的不同 Topic，乃至于不同子区，算不算同一个 channel?
// 注意，不同 Agent 视角下，可能面对的同一个 Session，因此需要结合 AgentToSession 才能对应到一个独立的，完整的 Session 信息
export type Channel = {
  id: string;
  channelId: string;
  providerId: string;
}

export type Account = {
  id: string;
  userId: string;
  providerId: string;
  accountId: string;
}


// 内存状态？
export type SessionAgent = {
  id: string;
  providerId: string;
  accountId: string;
  // active，offline?
  status: string;
  enabled: boolean;
  // other status
}

export type AgentToChannel = {
  agentId: string;
  sessionId: string;
}

type Message = {
  id: string;
  // 发送消息的 UserID
  senderId: string;
  // 收到消息的会话ID
  channelId: string;
  // 平台
  providerId: string;
  // 代行收发职责的 AgentId
  agentId: string;
  // 收发内容序号等平台数据
  providerMsgSeq: string;
}
