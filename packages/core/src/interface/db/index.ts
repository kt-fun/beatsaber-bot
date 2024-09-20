import {
  RelateAccount,
  RelateChannelInfo,
  Subscribe,
  SubscribeMember,
} from './models'

export * from './models'

export interface SubInfoRes {
  subscribe: Subscribe
  memberCount: number
  me: any
}

export interface SubInfoRes {
  subscribe: Subscribe
  memberCount: number
  me: any
}

export interface SubDetailWithGroupRes<T> {
  account: RelateAccount
  accountChannel: RelateChannelInfo<T>
  subscribeMember: SubscribeMember
  subscribe: Subscribe
  groupChannel: RelateChannelInfo<T>
}

export interface SubWithGroupRes<T> {
  subscribe: Subscribe
  groupChannel: RelateChannelInfo<T>
}

export interface DB<T> {
  getUserAccountsByUid(id: number): Promise<Record<string, RelateAccount>>

  batchGetOrCreateUBySessionInfo(s: T[]): Promise<RelateChannelInfo<T>[]>
  getUAndGBySessionInfo(
    s: T
  ): Promise<[RelateChannelInfo<T>, RelateChannelInfo<T>]>

  // binding
  addUserBindingInfo(account: Partial<RelateAccount>): Promise<void>

  // subscription
  upsertSubscription(data: Partial<Subscribe>): Promise<void>

  getSubscriptionInfoByUGID(gid: number, uid: number): Promise<SubInfoRes[]>
  getSubscriptionsByGID(gid: number): Promise<Record<string, Subscribe>>
  getAllSubScriptionByUIDAndPlatform(
    id: string | number,
    type: string
  ): Promise<SubDetailWithGroupRes<T>[]>

  // getSubscriptionInfoByType(type: string): Promise<SubWithGroupRes<T>[]>

  // subscriptionMember
  addSubscribeMember(data: Partial<SubscribeMember>): Promise<void>
  removeFromSubGroupBySubAndUid(subId: number, id: number): Promise<void>
}
