import {channels, users} from "~/support/mock-data";
import {afterAll, describe, expect, test} from "vitest";
import fs from "fs";
import {createCtx} from "~/support/create-ctx";
import {mockData} from "~/command/subscribe/subscribe.mock";
import {Channel} from "@/interface";
import {InvalidParamsError, MissingParamsError, SubscriptionNotExistError} from "@/services/errors";

const p = 'test-unsub'
afterAll(() => {
  fs.rmdirSync(p, { recursive: true })
})
fs.mkdirSync(p, { recursive: true })


const { testCmd, testEvent, db } = await createCtx(p, mockData)

// 两类订阅，事件发生时，触发订阅消息通知
// 1. 整个群聊级别的订阅，不与群聊用户关联。比如在群组内订阅 beatsaver mapper 53288 / 订阅新 Rank Map。

// 2. 订阅组，用户可以自由加入、退出。加入当前 Channel 的特定订阅组之后，用户绑定的对应 platformID 事件出现时(如果有），会进行通知。
// （这里就需要维护用户与 Channel 的关系，比如用户退出Channel 时，这个 Member 也应当变动，比如新用户加入 Channel，自动加入）

describe("remove subscription", async () => {
  test("remove subscription, missing type", async () => {
    const [res] = await testCmd('unsubscribe')
    expect(res).toEqual(InvalidParamsError.id)
  })

  test("remove subscription, error type", async () => {
    const [res] = await testCmd('unsubscribe', {
      options: {
        t: 'fdsafdas'
      }
    })
    expect(res).toEqual(InvalidParamsError.id)
  })

  test("remove not-exist subscription", async () => {
    const [res] = await testCmd('unsubscribe', {
      sess: { channel: mockData.channels[4] },
      options: { t: 'lbrank' },
    })
    expect(res).toEqual(SubscriptionNotExistError.id)
  })

  test("remove bsmap subscription, missing required input", async () => {
    const [res] = await testCmd('unsubscribe', {
      sess: { channel: mockData.channels[1] },
      options: { t: 'bsmap' },
    })
    expect(res).toEqual(MissingParamsError.id)
  })

  test("remove bsmap subscription, error input", async () => {
    const [res] = await testCmd('unsubscribe', {
      sess: { channel: mockData.channels[1] },
      options: { t: 'bsmap' },
      inputs: ['xssds ghg']
    })
    expect(res).toEqual(SubscriptionNotExistError.id)
  })
  test("remove bsmap subscription", async () => {
    await testRemoveSubscription('bsmap', channels[0], ['58338'])
  })
  test("remove blscore subscription", async () => {
    await testRemoveSubscription('blscore', channels[0], ['76561198960449289'])
  })
})


const testRemoveSubscription = async (
  type: string,
  channel: Channel,
  inputs: string[]
) => {
  const subscriptions = await db.getSubscriptionByChannelIDAndType(channel.id, type)
  expect(subscriptions.length).toEqual(1)
  const [res] = await testCmd('unsubscribe', {
    sess: {channel},
    options: { t: type },
    inputs
  })
  const newSubscriptions = await db.getSubscriptionByChannelIDAndType(channel.id, type)
  expect(newSubscriptions.length).toEqual(0)
  expect(res).toEqual(`commands.bsbot.unsubscribe.success.${type}`)
}
