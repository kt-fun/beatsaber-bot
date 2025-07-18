import { User, Subscription } from "@/index";

const now = new Date()
const time = {createdAt: now, updatedAt: now}
export const users: User[] = [
  {id: '1', name: 'a', ...time},
]

const accounts = [
]

export const channels = [
  {id: '1', channelId: 'onebot:2', providerId: 'koishi:onebot', ...time},
  {id: '2', channelId: 'onebot:1', providerId: 'koishi:onebot', ...time},
  {id: '3', channelId: 'onebot:7', providerId: 'koishi:onebot', ...time},
  {id: '4', channelId: 'onebot:10', providerId: 'koishi:onebot', ...time},
  {id: '5', channelId: 'onebot:11', providerId: 'koishi:onebot', ...time},
]

export const subscriptions: Subscription[] = [
  { id: 'lbrank::1', type: 'lbrank', eventType:'schedule', enabled: true, channelId: '1', data: null, ...time },
  { id: 'lbrank::2', type: 'lbrank', eventType:'schedule', enabled: false, channelId: '2', data: null, ...time },
  { id: 'lbrank::3', type: 'lbrank', eventType:'schedule', enabled: true, channelId: '3', data: null, ...time },
]

export const mockData = {
  users,
  channels,
  accounts,
  subscriptions,
  subscriptionMembers: [],
  sess: {
    user: users[0],
    channel: channels[0],
    mentions: [],
    locale: 'zh-CN'
  }
}


