import {channels, mockData, users} from "../subscribe.mock";
import {afterAll, describe, expect, test} from "vitest";
import fs from "fs";
import {createCtx} from "~/support/create-ctx";
import {InvalidParamsError, NoneSubscriptionError, SubscriptionNotExistError} from "@/services/errors";

const p = 'test-join-group'

afterAll(() => {
  fs.rmdirSync(p, { recursive: true })
})
fs.mkdirSync(p, { recursive: true })

const { testCmd, testEvent, db } = await createCtx(p, mockData)

describe("join group subscription", async () => {

  test("join not-exist group type", async () => {
    const user = users[0]
    const channel = channels[4]
    const type = 'bsmap'
    const [res] = await testCmd('join-subscription-group', {
      sess: { channel, user },
      options: { t: type }
    })
    const newSubscriptions = await db.getIDSubscriptionByChannelIDAndType(channel.id, type)
    expect(newSubscriptions.length).toEqual(0)
    expect(res).toEqual(InvalidParamsError.id)
  })

  test("join not-exist bsmap-group subscription", async () => {
    const user = users[0]
    const channel = channels[4]
    const type = 'bsmap-group'
    const subscriptions = await db.getIDSubscriptionByChannelIDAndType(channel.id, type)
    expect(subscriptions.length).toEqual(0)
    const [res] = await testCmd('join-subscription-group', {
      sess: { channel, user },
      options: { t: type }
    })
    const newSubscriptions = await db.getIDSubscriptionByChannelIDAndType(channel.id, type)
    expect(newSubscriptions.length).toEqual(0)
    expect(res).toEqual(SubscriptionNotExistError.id)
  })

  test("join bsmap-group subscription, already a member", async () => {
    const user = users[1]
    const channel = channels[0]
    const type = 'bsmap-group'
    const subscriptions = await db.getIDSubscriptionByChannelIDAndType(channel.id, type)
    const member = await db.getSubscriptionMemberByUserChannelAndType(user.id, channel.id, type)
    expect(subscriptions.length).toEqual(1)
    expect(member.me).toEqual(false)
    const [res] = await testCmd('join-subscription-group', {
      sess: { channel, user },
      options: { t: type }
    })
    const newMember = await db.getSubscriptionMemberByUserChannelAndType(user.id, channel.id, type)
    expect(newMember?.me).toEqual(true)
    expect(res).toEqual(`commands.bsbot.join-subscription-group.success.${type}`)
  })

  test("join bsmap-group subscription", async () => {
    const user = users[3]
    const channel = channels[0]
    const type = 'bsmap-group'
    const subscriptions = await db.getIDSubscriptionByChannelIDAndType(channel.id, type)
    const member = await db.getSubscriptionMemberByUserChannelAndType(user.id, channel.id, type)
    expect(member.me).toEqual(false)
    expect(subscriptions.length).toEqual(1)
    const [res] = await testCmd('join-subscription-group', {
      sess: { channel, user },
      options: { t: type }
    })
    const newMember = await db.getSubscriptionMemberByUserChannelAndType(user.id, channel.id, type)
    expect(newMember?.me).toEqual(true)
    expect(res).toEqual(`commands.bsbot.join-subscription-group.success.${type}`)
  })

  test("join blscore-group subscription", async () => {
    const user = users[3]
    const channel = channels[0]
    const type = 'blscore-group'
    const subscriptions = await db.getIDSubscriptionByChannelIDAndType(channel.id, type)
    const member = await db.getSubscriptionMemberByUserChannelAndType(user.id, channel.id, type)
    expect(member.me).toEqual(false)
    expect(subscriptions.length).toEqual(1)
    const [res] = await testCmd('join-subscription-group', {
      sess: { channel, user },
      options: { t: type }
    })
    const newMember = await db.getSubscriptionMemberByUserChannelAndType(user.id, channel.id, type)
    expect(newMember?.me).toEqual(true)
    expect(res).toEqual(`commands.bsbot.join-subscription-group.success.${type}`)
  })

})
