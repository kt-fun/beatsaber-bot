import {migrateDB} from "~/support/db/init-db";
import {getDB, loadDB} from "~/support/db/db";
import * as tables from '~/support/db/schema'
import { User, Channel, Account, Subscription, SubscriptionMember } from "@/index";
import {faker} from "@faker-js/faker";
import {Sess} from "~/support/create-ctx";

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
    providerUsername: faker.person.fullName(),
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
  getAccount({userId: '1', accountId: '1922350521131465', providerId: 'scoresaber' }),
  // only bind beatsaver
  getAccount({userId: '2', accountId: '41378', providerId: 'beatsaver' }),
  getAccount({userId: '2', accountId: '76561198988695829', providerId: 'scoresaber' }),
  // only beatleader
  getAccount({userId: '3', accountId: '76561198960449289', providerId: 'beatleader' }),
]

export const channels = [
  {id: '1', channelId: 'onebot:2', providerId: 'koishi:onebot', ...time},
  {id: '2', channelId: 'onebot:1', providerId: 'koishi:onebot', ...time},
  {id: '3', channelId: 'onebot:7', providerId: 'koishi:onebot', ...time},
  {id: '4', channelId: 'onebot:10', providerId: 'koishi:onebot', ...time},
  {id: '5', channelId: 'onebot:11', providerId: 'koishi:onebot', ...time},
]

export const subscriptions: Subscription[] = [

  // 定时任务
  { id: 'lbrank::1', type: 'lbrank', eventType: 'schedule', enabled: true, channelId: '1', data: null, ...time },
  { id: 'lbrank::2', type: 'lbrank', eventType: 'schedule', enabled: false, channelId: '2', data: null, ...time },
  { id: 'lbrank::3', type: 'lbrank', eventType: 'schedule', enabled: true, channelId: '3', data: null, ...time },
  // 直接订阅某个不相关的平台用户。
  { id: 'bsmap::3::58338', type: 'bsmap', eventType: 'bsmap-update', enabled: false, channelId: '3', data: { mapperId: '58338' }, ...time },
  { id: 'blscore::3::76561198960449289', type: 'blscore', eventType: 'blscore-update', enabled: false, channelId: '3', data: { playerId: '76561198960449289' }, ...time },
  { id: '6', type: 'bsmap-group', eventType: 'bsmap-update', enabled: false, channelId: '3', data: null, ...time },
  { id: '7', type: 'blscore-group', eventType: 'blscore-update', enabled: false, channelId: '3', data: null, ...time },
]



export const subscriptionMembers: SubscriptionMember[] = [
  {memberId: '1', subscriptionId: '6', subscribeData: { mapperId: '58338' }, ...time},
]

export const defaultSess: Sess = {
  user: users[0],
  channel: channels[0],
  mentions: [],
  locale: 'zh-CN'
}
export const defaultMock = {
  users,
  channels,
  accounts,
  subscriptions,
  subscriptionMembers,
  sess: defaultSess
}

export type MockData = {
  users: User[],
  channels: Channel[]
  accounts: Account[],
  subscriptions: Subscription[],
  subscriptionMembers: SubscriptionMember[]
  sess: Sess
}
export async function seed(path: string, data: MockData) {
  const db = loadDB(path);
  migrateDB(db)
  if(data.users.length > 0) {
    await db.insert(tables.user).values(data.users)
  }
  if(data.accounts.length > 0) {
    await db.insert(tables.account).values(data.accounts as any)
  }
  if(data.channels.length > 0) {
    await db.insert(tables.channel).values(data.channels as any)
  }
  if(data.subscriptions.length > 0) {
    await db.insert(tables.bsSubscribe).values(data.subscriptions)
  }
  if(data.subscriptionMembers.length > 0) {
    await db.insert(tables.bsSubscribeMember).values(data.subscriptionMembers)
  }

  return getDB(db)
}
