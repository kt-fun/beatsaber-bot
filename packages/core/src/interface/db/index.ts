import type {
  Account,
  Subscription,
  SubscriptionMember,
} from './models'
import {Channel, User} from "@/core";

export type {
  User,
  Channel,
  Account,
  Subscription,
  SubscriptionMember,
  Preference
} from './models'

export interface SubInfoRes {
  subscription: Subscription
  memberCount: number
  me: any
}

export interface SubInfoRes {
  subscription: Subscription
  memberCount: number
  me: any
}

export interface SubDetailWithGroupRes {
  account: Account
  user: User
  channel: Channel
  subscriptionMember: SubscriptionMember
  subscription: Subscription
}

export interface SubWithGroupRes {
  subscription: Subscription
  channel: Channel
}

export type AddSubscriptionMember = {
  subscriptionId: string
  memberId: string
  subscribeData?: any
  createdAt?: Date
  updatedAt?: Date
}
export interface DB {
  // preference
  storeUserPreference<V = any>(uid: string, value: V): Promise<boolean>
  getUserPreference<V = any>(uid: string): Promise<V>
  // user account
  getUserAccountsByUid(id: string): Promise<Record<string, Account>>
  addUserBindingInfo(account: Partial<Account>): Promise<void>
  // subscription
  upsertSubscription(data: Partial<Subscription>): Promise<void>
  getSubscriptionInfoByUGID(gid: string, uid: string): Promise<SubInfoRes[]>
  getSubscriptionMemberByUserChannelAndType(userId: string, channelId: string, type: string): Promise<SubInfoRes | null>
  getSubscriptionByID(id: string): Promise<Subscription | null>
  getSubscriptionsByGID(gid: string): Promise<Record<string, Subscription>>

  getChannelSubscriptionByChannelIDAndType(channelId: string, type: string): Promise<Subscription | null>
  getIDSubscriptionByGID(gid: string): Promise<Subscription[]>
  getIDSubscriptionByType(type: string): Promise<SubWithGroupRes[]>
  removeIDSubscriptionByID(id: string): Promise<void>
  getIDSubscriptionByChannelIDAndType(gid: string, type: string): Promise<Subscription[]>
  getAllSubscriptionByUIDAndPlatform(id: string, type: string): Promise<SubDetailWithGroupRes[]>
  getSubscriptionsByType(type: string): Promise<SubWithGroupRes[]>
  addSubscribeMember(data: AddSubscriptionMember): Promise<void>
  removeFromSubGroupBySubAndUid(subId: string, id: string): Promise<void>
}
