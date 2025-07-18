import {channels, users} from "../subscribe.mock";
import {afterAll, describe, expect, test} from "vitest";
import fs from "fs";
import {createCtx} from "~/support/create-ctx";

const p = 'test-sub-group'

afterAll(() => {
  fs.rmdirSync(p, { recursive: true })
})
fs.mkdirSync(p, { recursive: true })

const { testCmd, testEvent, db } = await createCtx(p)

// 两类订阅，事件发生时，触发订阅消息通知
// 1. 整个群聊级别的订阅，不与群聊用户关联。比如在群组内订阅 beatsaver mapper 53288 / 订阅新 Rank Map。
// 2. 订阅组，用户可以自由加入、退出。加入当前 Channel 的特定订阅组之后，用户绑定的对应 platformID 事件出现时(如果有），会进行通知。
describe("subscription group", async () => {
  test("add bsmap group subscription", async () => {
    const channel = channels[3]
    const type = 'bsmap-group'
    const subscriptions = await db.getSubscriptionByChannelIDAndType(channel.id, type)
    expect(subscriptions.length).toEqual(0)
    const [res] = await testCmd('subscribe', {
      sess: {channel},
      options: { t: type }
    })
    const newSubscriptions = await db.getSubscriptionByChannelIDAndType(channel.id, type)
    expect(newSubscriptions.length).toEqual(1)
    expect(res).toEqual(`commands.bsbot.subscribe.success.${type}`)
  }, 300000)

  test("add exist bsmap group subscription", async () => {
    const channel = channels[2]
    const type = 'bsmap-group'
    const subscriptions = await db.getSubscriptionByChannelIDAndType(channel.id, type)
    expect(subscriptions.length).toEqual(1)
    const [res] = await testCmd('subscribe', {
      sess: {channel},
      options: { t: type },
    })
    const newSubscriptions = await db.getSubscriptionByChannelIDAndType(channel.id, type)
    expect(newSubscriptions.length).toEqual(1)
    const {enabled, updatedAt, ...oldSubscription } = subscriptions[0]
    const { updatedAt: newUpdatedAt, ...newSubscription } = newSubscriptions[0]
    expect(newSubscription).toMatchObject({
      ...oldSubscription,
      enabled: true,
    })
    expect(res).toEqual(`commands.bsbot.subscribe.success.${type}`)
  }, 300000)

  test("add bsmap group subscription, ignore invalid input", async () => {
    const channel = channels[2]
    const type = 'bsmap-group'
    const subscriptions = await db.getSubscriptionByChannelIDAndType(channel.id, type)
    expect(subscriptions.length).toEqual(1)
    const [res] = await testCmd('subscribe', {
      sess: {channel},
      options: { t: type },
      inputs: ['dsadfa']
    })
    const newSubscriptions = await db.getSubscriptionByChannelIDAndType(channel.id, type)
    expect(newSubscriptions.length).toEqual(1)
    const {enabled, updatedAt, ...oldSubscription } = subscriptions[0]
    const { updatedAt: newUpdatedAt, ...newSubscription } = newSubscriptions[0]
    expect(newSubscription).toMatchObject({
      ...oldSubscription,
      enabled: true,
    })
    expect(res).toEqual(`commands.bsbot.subscribe.success.${type}`)
  }, 300000)

  test("add blscore group subscription", async () => {
    const type = 'blscore-group'
    const channel = channels[3]
    const subscriptions = await db.getSubscriptionByChannelIDAndType(channel.id, type)
    expect(subscriptions.length).toEqual(0)
    const [res] = await testCmd('subscribe', {
      sess: {channel},
      options: { t: type }
    })
    const newSubscriptions = await db.getSubscriptionByChannelIDAndType(channel.id, type)
    expect(newSubscriptions.length).toEqual(1)
    expect(res).toEqual(`commands.bsbot.subscribe.success.${type}`)
  }, 300000)
})
