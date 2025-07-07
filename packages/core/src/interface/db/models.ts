export interface User {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export interface Channel {
  id: string
  // provider channel id
  channelId: string;
  providerId: string;
  createdAt?: Date
  updatedAt?: Date
}

// agent 是易失的，应该存储在内存中？不，应该放在存储中，然后用状态字段进行区分。
// agent 与 Channel 的关系也是易变的。
// agent, agent2channel
export interface Agent {
  id: string;
  providerId: string;
  accountId: string;
  status: string;
  enabled: boolean;
}
export interface Agent2Channel {
  agentId: string;
  channelId: string;
}

export interface Account<T = any> {
  id: string
  userId: string
  providerId: string
  // provider account id
  accountId: string
  // oauth | id
  type: string
  providerUsername?: string
  scope?: string
  accessToken?: string
  accessTokenExpiresAt?: Date
  refreshToken?: string
  refreshTokenExpiresAt?: Date
  idToken?: string
  metadata?: T
  lastModifiedAt: Date
  lastRefreshAt: Date
  createdAt: Date
}

export interface Subscription {
  id: string
  channelId: string
  type: string
  enabled: boolean
  data: any
  createdAt: Date
  updatedAt: Date
}

export interface SubscriptionMember {
  subscribeId: string
  memberId: string
  subscribeData: any
  createdAt: Date
  updatedAt: Date
}



export type Preference<T = any> = {
  userId: string
  channelId: string
  data: T
  createdAt: Date
  updatedAt: Date
}
