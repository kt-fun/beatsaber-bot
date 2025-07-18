import type {
  Account,
  Subscription,
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
  me: boolean
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


export type EventTarget = {
  channel: Channel,
  // user 在 channel 对应平台的 account
  users: (User& {account?: Account, channelAccount: Account})[],
  subscriptions: Subscription[]
}


interface SubscriptionRepository {
}


export interface DB extends SubscriptionRepository {
  // preference
  storeUserPreference<V = any>(uid: string, value: V): Promise<boolean>
  getUserPreference<V = any>(uid: string): Promise<V>

  // user account
  getUserAccountsByUserIdAndType<T extends readonly string[] = string[]>(id: string, types: T): Promise<Record<T[number], Account>>
  getUserAccountsByUserId(id: string): Promise<Account[]>
  addUserAccount(account: Partial<Account>): Promise<void>


  // event targets
  getBLScoreEventTargets(playerId: string): Promise<EventTarget[]>
  getBSMapEventTargets(mapperId: string): Promise<EventTarget[]>
  getScheduleEventTargets(eventType: string): Promise<EventTarget[]>

//   subscription
  // 对于 group 级别的 subscription，一个 channel 只有一个
  getSubscriptionByID(id: string): Promise<Subscription | null>
  getGroupSubscriptionByChannelIDAndType(channelId: string, type: string): Promise<Subscription | null>
  getSubscriptionByChannelIDAndType(channelId: string, type: string): Promise<Subscription[]>

  getSubscriptionInfoByUserAndChannelID(userId: string, channelId: string): Promise<SubInfoRes[]>
  getSubscriptionMemberByUserChannelAndType(userId: string, channelId: string, type: string): Promise<SubInfoRes | null>

  // insert
  upsertSubscription(data: Partial<Subscription>): Promise<void>

  // remove
  removeSubscriptionByID(id: string): Promise<void>

  // subscription member
  removeSubscriptionMemberBySubIdAndMemberId(subId: string, id: string): Promise<void>
  addSubscriptionMember(data: AddSubscriptionMember): Promise<void>
}

export function mergeEventTargets(part1: EventTarget[], part2: EventTarget[]) {
  const targets = part1.concat(part2)
  const maps = targets.reduce((acc, cur) => {
    let m = acc.get(cur.channel.id)
    if(!m) {
      m = { channel: cur.channel, users: [], subscriptions: []}
    }
    if(cur.users.length > 0) {
      m.users = m.users.concat(cur.users)
    }
    if(cur.subscriptions.length > 0) {
      m.subscriptions = m.subscriptions.concat(cur.subscriptions)
    }
    acc.set(cur.channel.id, m)
    return acc
  }, new Map<string, EventTarget>())
  return Array.from(maps.values())
}
