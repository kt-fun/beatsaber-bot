import {channels, mockData, users} from "../subscribe.mock";
import {afterAll, describe, expect, test} from "vitest";
import fs from "fs";
import {createCtx} from "~/support/create-ctx";
import {InvalidParamsError, SubscriptionNotExistError} from "@/services/errors";

const p = 'test-leave-group'

afterAll(() => {
  fs.rmdirSync(p, { recursive: true })
})
fs.mkdirSync(p, { recursive: true })

const { testCmd, testEvent, db } = await createCtx(p, mockData)

describe("leave group subscription", async () => {

  test("leave not-exist group type", async () => {
    const user = users[0]
    const channel = channels[4]
    const type = 'bsmap'
    const [res] = await testCmd('leave-subscription-group', {
      sess: { channel, user },
      options: { t: type }
    })
    const newSubscriptions = await db.getIDSubscriptionByChannelIDAndType(channel.id, type)
    expect(newSubscriptions.length).toEqual(0)
    expect(res).toEqual(InvalidParamsError.id)
  }, 300000)

  test("leave not-exist bsmap-group subscription", async () => {
    const user = users[0]
    const channel = channels[4]
    const type = 'bsmap-group'
    const subscriptions = await db.getIDSubscriptionByChannelIDAndType(channel.id, type)
    expect(subscriptions.length).toEqual(0)
    const [res] = await testCmd('leave-subscription-group', {
      sess: { channel, user },
      options: { t: type }
    })
    const newSubscriptions = await db.getIDSubscriptionByChannelIDAndType(channel.id, type)
    expect(newSubscriptions.length).toEqual(0)
    expect(res).toEqual(SubscriptionNotExistError.id)
  }, 300000)

  test("leave bsmap-group subscription, not a member", async () => {
    const user = users[1]
    const channel = channels[0]
    const type = 'bsmap-group'
    const subscriptions = await db.getIDSubscriptionByChannelIDAndType(channel.id, type)
    const member = await db.getSubscriptionMemberByUserChannelAndType(user.id, channel.id, type)
    expect(subscriptions.length).toEqual(1)
    expect(member.me).toEqual(false)
    const [res] = await testCmd('leave-subscription-group', {
      sess: { channel, user },
      options: { t: type }
    })
    const newMember = await db.getSubscriptionMemberByUserChannelAndType(user.id, channel.id, type)
    expect(newMember?.me).toEqual(false)
    expect(res).toEqual(`commands.bsbot.leave-subscription-group.not-member.${type}`)
  }, 300000)

  test("leave bsmap-group subscription", async () => {
    const user = users[0]
    const channel = channels[0]
    const type = 'bsmap-group'
    const subscriptions = await db.getIDSubscriptionByChannelIDAndType(channel.id, type)
    const member = await db.getSubscriptionMemberByUserChannelAndType(user.id, channel.id, type)
    expect(member.me).toEqual(true)
    expect(subscriptions.length).toEqual(1)
    const [res] = await testCmd('leave-subscription-group', {
      sess: { channel, user },
      options: { t: type }
    })
    const newMember = await db.getSubscriptionMemberByUserChannelAndType(user.id, channel.id, type)
    expect(newMember?.me).toEqual(false)
    expect(res).toEqual(`commands.bsbot.leave-subscription-group.success.${type}`)
  }, 300000)

  test("leave blscore-group subscription", async () => {
    const user = users[0]
    const channel = channels[0]
    const type = 'blscore-group'
    const subscriptions = await db.getIDSubscriptionByChannelIDAndType(channel.id, type)
    const member = await db.getSubscriptionMemberByUserChannelAndType(user.id, channel.id, type)
    expect(member.me).toEqual(true)
    expect(subscriptions.length).toEqual(1)
    const [res] = await testCmd('leave-subscription-group', {
      sess: { channel, user },
      options: { t: type }
    })
    const newMember = await db.getSubscriptionMemberByUserChannelAndType(user.id, channel.id, type)
    expect(newMember?.me).toEqual(false)
    expect(res).toEqual(`commands.bsbot.leave-subscription-group.success.${type}`)
  }, 300000)

})
