export interface RelateAccount {
  id: number
  uid: number
  type: string // oauth | id-public
  platform: string
  platformUname: string
  platformUid: string
  platformScope: string // oauth-scope
  accessToken: string
  refreshToken: string
  otherPlatformInfo: any
  lastModifiedAt: Date
  lastRefreshAt: Date
  status: string
}

export interface SubscribeMember {
  subscribeId: number
  memberUid: number
  subscribeData: any
  joinedAt: Date
}

export interface Subscribe {
  id: number
  gid: number
  type: string
  time: Date
  enable: boolean
  data: any
}

export type RelateChannelInfo<CHANNEL> = {
  id: number
  name: string
  type: 'user' | 'group' | string
  // enable: boolean
} & CHANNEL

export type UserPreference<T = any> = {
  uid: number
  gid: number
  data: T
}
