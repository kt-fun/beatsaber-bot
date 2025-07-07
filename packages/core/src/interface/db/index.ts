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
  getSubscriptionsByGID(gid: string): Promise<Record<string, Subscription>>
  getIDSubscriptionByGID(gid: string): Promise<Subscription[]>
  getIDSubscriptionByType(type: string): Promise<SubWithGroupRes[]>
  removeIDSubscriptionByID(id: string): Promise<void>
  getIDSubscriptionByChannelIDAndType(gid: string, type: string): Promise<Subscription[]>
  getAllSubscriptionByUIDAndPlatform(id: string, type: string): Promise<SubDetailWithGroupRes[]>
  getSubscriptionsByType(type: string): Promise<SubWithGroupRes[]>
  addSubscribeMember(data: Partial<SubscriptionMember>): Promise<void>
  removeFromSubGroupBySubAndUid(subId: string, id: string): Promise<void>
}
