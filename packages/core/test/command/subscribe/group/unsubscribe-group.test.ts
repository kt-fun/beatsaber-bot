import {channels, mockData, users} from "../subscribe.mock";
import {afterAll, describe, expect, test} from "vitest";
import fs from "fs";
import {createCtx} from "~/support/create-ctx";
import {SubscriptionNotExistError} from "@/services/errors";

const p = 'test-unsub-group'

afterAll(() => {
  fs.rmdirSync(p, { recursive: true })
})
fs.mkdirSync(p, { recursive: true })

const { testCmd, testEvent, db } = await createCtx(p, mockData)

// 两类订阅，事件发生时，触发订阅消息通知
// 1. 整个群聊级别的订阅，不与群聊用户关联。比如在群组内订阅 beatsaver mapper 53288 / 订阅新 Rank Map。
// 2. 订阅组，用户可以自由加入、退出。加入当前 Channel 的特定订阅组之后，用户绑定的对应 platformID 事件出现时(如果有），会进行通知。
// 在删除时，只是会简单禁用。

describe("remove group subscription", async () => {
  test("remove bsmap group subscription", async () => {
    const channel = channels[0]
    const type = 'bsmap-group'
    const subscriptions = await db.getIDSubscriptionByChannelIDAndType(channel.id, type)
    expect(subscriptions.length).toEqual(1)
    const [res] = await testCmd('unsubscribe', {
      sess: {channel},
      options: { t: type }
    })
    const newSubscriptions = await db.getIDSubscriptionByChannelIDAndType(channel.id, type)
    expect(newSubscriptions.length).toEqual(1)
    const { updatedAt: newUpdatedAt, ...newSubscription } = newSubscriptions[0]
    expect(newSubscription?.enabled).toEqual(false)
    expect(res).toEqual(`commands.bsbot.unsubscribe.success.${type}`)
  }, 300000)

  test("remve not-exist bsmap group subscription", async () => {
    const channel = channels[4]
    const type = 'bsmap-group'
    const subscriptions = await db.getIDSubscriptionByChannelIDAndType(channel.id, type)
    expect(subscriptions.length).toEqual(0)
    const [res] = await testCmd('unsubscribe', {
      sess: {channel},
      options: { t: type },
    })
    const newSubscriptions = await db.getIDSubscriptionByChannelIDAndType(channel.id, type)
    expect(newSubscriptions.length).toEqual(0)
    expect(res).toEqual(SubscriptionNotExistError.id)
  }, 300000)

  test("remove blscore group subscription", async () => {
    const type = 'blscore-group'
    const channel = channels[0]
    const subscriptions = await db.getIDSubscriptionByChannelIDAndType(channel.id, type)
    expect(subscriptions.length).toEqual(1)
    const [res] = await testCmd('unsubscribe', {
      sess: {channel},
      options: { t: type },
    })
    const newSubscriptions = await db.getIDSubscriptionByChannelIDAndType(channel.id, type)
    expect(newSubscriptions.length).toEqual(1)
    expect(res).toEqual(`commands.bsbot.unsubscribe.success.${type}`)
  }, 300000)
})
