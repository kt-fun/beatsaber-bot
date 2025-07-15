import {migrateDB} from "~/support/db/init-db";
import {getDB, loadDB} from "~/support/db/db";
import * as tables from '~/support/db/schema'
import { User, Channel, Account, Subscription, SubscriptionMember } from "@/index";
import {faker} from "@faker-js/faker";

const now = new Date()
const time = {createdAt: now, updatedAt: now}
export const users: User[] = [
  {id: '1', name: 'a', ...time},
  {id: '2', name: 'b', ...time},
  {id: '3', name: 'c', ...time},
  {id: '4', name: 'd', ...time},
]

const getAccount = ({userId, accountId, providerId}) => {
  return {
    id: faker.string.uuid(),
    type: 'id',
    providerName: faker.person.fullName(),
    status: 'ok',
    accountId,
    providerId,
    userId,
    ...time
  }
}

const accounts = [
  getAccount({userId: '1', accountId: 'test-1', providerId: 'test' }),
  getAccount({userId: '2', accountId: 'test-2', providerId: 'test' }),
  getAccount({userId: '3', accountId: 'test-3', providerId: 'test' }),
  getAccount({userId: '4', accountId: 'test-4', providerId: 'test' }),
  // bind both
  getAccount({userId: '1', accountId: '58338', providerId: 'beatsaver' }),
  getAccount({userId: '1', accountId: '1922350521131465', providerId: 'beatleader' }),
  // only bind beatsaver
  getAccount({userId: '2', accountId: '41378', providerId: 'beatsaver' }),
  // only beatleader
  getAccount({userId: '3', accountId: '76561198960449289', providerId: 'beatleader' }),
]

export const channels = [
  {id: '1', channelId: 'onebot:2', providerId: 'koishi:onebot', ...time},
  {id: '2', channelId: 'onebot:1', providerId: 'koishi:onebot', ...time},
  {id: '3', channelId: 'onebot:7', providerId: 'koishi:onebot', ...time},
]

export const subscriptions: Subscription[] = [
  // 定时任务
  { id: '1', type: 'lb-rank', enabled: true, channelId: '1', data: null, ...time },
  { id: '2', type: 'lb-rank', enabled: false, channelId: '2', data: null, ...time },
  { id: '3', type: 'lb-rank', enabled: true, channelId: '3', data: null, ...time },

  // 直接订阅某个不相关的人。
  { id: '4', type: 'batsaver-map-channel', enabled: false, channelId: '3', data: { mapperId: '58338' }, ...time },
  { id: '5', type: 'beatleader-score-channel', enabled: false, channelId: '3', data: { playerId: '76561198960449289' }, ...time },
  { id: '6', type: 'batsaver-map', enabled: false, channelId: '3', data: null, ...time },
  { id: '7', type: 'beatleader-score', enabled: false, channelId: '3', data: null, ...time },
]
// 事件处理缓存。

export const subscriptionMembers: SubscriptionMember[] = [
  {memberId: '1', subscriptionId: '5', subscribeData: { mapperId: '58338' }, ...time},
]

export async function seed(path: string) {
  const db = loadDB(path);
  migrateDB(db)
  await db.insert(tables.user).values(users)
  await db.insert(tables.account).values(accounts)
  await db.insert(tables.channel).values(channels)
  await db.insert(tables.bsSubscribe).values(subscriptions)
  await db.insert(tables.bsSubscribeMember).values(subscriptionMembers)
  return getDB(db)
}
