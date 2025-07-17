
import {afterAll, describe, expect, test} from "vitest";
import fs from "fs";
import {createCtx} from "~/support/create-ctx";
import { channels } from "~/support/mock-data";
import {mockData} from "./subscribe.mock";
import {BSAccountNotFoundError, InvalidParamsError, NoneSubscriptionError} from "@/services/errors";

const p = 'test-sub'
afterAll(() => {
  fs.rmdirSync(p, { recursive: true })
})
fs.mkdirSync(p, { recursive: true })


const { testCmd, testEvent, db } = await createCtx(p, mockData)

// 两类订阅，事件发生时，触发订阅消息通知
// 1. 整个群聊级别的订阅，不与群聊用户关联。比如在群组内订阅 beatsaver mapper 53288 / 订阅新 Rank Map。

// 2. 订阅组，用户可以自由加入、退出。加入当前 Channel 的特定订阅组之后，用户绑定的对应 platformID 事件出现时(如果有），会进行通知。
// （这里就需要维护用户与 Channel 的关系，比如用户退出Channel 时，这个 Member 也应当变动，比如新用户加入 Channel，自动加入）

describe("subscription", async () => {
  test("show empty subscription", async () => {
    const [res] = await testCmd('subscribe', {
      sess: {channel: channels[4]}
    })
    expect(res).toEqual(NoneSubscriptionError.id)
  }, 300000)

  test("show subscriptions", async () => {
    const [res] = await testCmd('subscribe')
    expect(res).toEqual(expect.stringMatching(/^commands\.bsbot\.subscription\.info\.header/))
  }, 300000)

  test("add subscription", async () => {
    const channel = channels[3]
    const type = 'lbrank'
    const subscriptions = await db.getIDSubscriptionByChannelIDAndType(channel.id, type)
    expect(subscriptions.length).toEqual(0)
    const [res] = await testCmd('subscribe', {
      sess: {channel},
      options: { t: type }
    })
    const newSubscriptions = await db.getIDSubscriptionByChannelIDAndType(channel.id, type)
    expect(newSubscriptions.length).toEqual(1)
    expect(res).toEqual(`commands.bsbot.subscription.success.${type}`)
  }, 300000)

  test("add exist subscription", async () => {
    const channel = channels[2]
    const type = 'lbrank'
    const subscriptions = await db.getIDSubscriptionByChannelIDAndType(channel.id, type)
    expect(subscriptions.length).toEqual(1)
    const [res] = await testCmd('subscribe', {
      sess: {channel},
      options: { t: 'lbrank' }
    })
    const newSubscriptions = await db.getIDSubscriptionByChannelIDAndType(channel.id, type)
    expect(newSubscriptions.length).toEqual(1)
    const {enabled, updatedAt, ...oldSubscription } = subscriptions[0]
    const { updatedAt: newUpdatedAt, ...newSubscription } = newSubscriptions[0]
    expect(newSubscription).toMatchObject({
      ...oldSubscription,
      enabled: true,
    })
    expect(res).toEqual(`commands.bsbot.subscription.success.${type}`)
  }, 300000)

  test("add error subscription type", async () => {
    const channel = channels[0]
    const type = 'error-subscription-type'
    const subscriptions = await db.getIDSubscriptionByChannelIDAndType(channel.id, type)
    expect(subscriptions.length).toEqual(0)
    const res = await testCmd('subscribe', {
      sess: {channel},
      options: { t: type }
    })
    expect(res[0]).toEqual(InvalidParamsError.id)
  }, 300000)

  test("miss subscription required input", async () => {
    const channel = channels[1]
    const type = 'bsmap'
    const subscriptions = await db.getIDSubscriptionByChannelIDAndType(channel.id, type)
    expect(subscriptions.length).toEqual(0)
    const res = await testCmd('subscribe', {
      sess: {channel},
      options: { t: type },
      inputs: []
    })
    expect(res[0]).toEqual(InvalidParamsError.id)

  }, 300000)

  test("error subscription input", async () => {
    const channel = channels[1]
    const type = 'bsmap'
    const subscriptions = await db.getIDSubscriptionByChannelIDAndType(channel.id, type)
    expect(subscriptions.length).toEqual(0)
    const res = await testCmd('subscribe', {
      sess: {channel},
      options: { t: type },
      inputs: ["fadsf"]
    })
    expect(res[0]).toEqual(InvalidParamsError.id)
  }, 300000)


  test("add bsmap subscription", async () => {
    const type = 'bsmap'
    const channel = channels[3]
    const subscriptions = await db.getIDSubscriptionByChannelIDAndType(channel.id, type)
    expect(subscriptions.length).toEqual(0)
    const [res] = await testCmd('subscribe', {
      sess: {channel},
      options: { t: type },
      inputs: ['58338']
    })
    const newSubscriptions = await db.getIDSubscriptionByChannelIDAndType(channel.id, type)
    expect(newSubscriptions.length).toEqual(1)
    expect(res).toEqual(`commands.bsbot.subscription.success.${type}`)
  }, 300000)

  test("add blscore subscription", async () => {
    const type = 'blscore'
    const channel = channels[3]
    const subscriptions = await db.getIDSubscriptionByChannelIDAndType(channel.id, type)
    expect(subscriptions.length).toEqual(0)
    const [res] = await testCmd('subscribe', {
      sess: {channel},
      options: { t: type },
      inputs: ['1922350521131465']
    })
    const newSubscriptions = await db.getIDSubscriptionByChannelIDAndType(channel.id, type)
    expect(newSubscriptions.length).toEqual(1)
    expect(res).toEqual(`commands.bsbot.subscription.success.${type}`)
  }, 300000)
})
