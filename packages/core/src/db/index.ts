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
  valid: string
}

export interface SubscribeMember {
  id: number
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

export type UserAndUGroupRel = {
  uid: number
  gid: number
  // optional
  nickname: string
}

export type RelateChannelInfo<CHANNEL> = {
  id: number
  name: string
  type: 'user' | 'group' | string
  enable: boolean
} & CHANNEL
