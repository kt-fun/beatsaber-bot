import {channels, users} from "../mock/data.js";
import {afterAll, describe, expect, test} from "vitest";
import fs from "fs";
import {createCtx} from "../support/create-ctx.js";

const defaultSess = {
  user: users[0],
  channel: channels[0],
  mentions: [],
  locale: 'zh-CN'
}
const p = 'test-sub'
afterAll(() => {
  fs.rmdirSync(p, { recursive: true })
})
fs.mkdirSync(p, { recursive: true })


const { testCmd, testEvent } = await createCtx(p, defaultSess)

describe("beatsaber map subscription group ", async () => {


})

describe("beatleader score subscription group ", async () => {
  test("add subscription", async () => {

  }, 300000)

  test("add exist subscription", async () => {

  }, 300000)

  test("remove subscription", async () => {

  }, 300000)

  test("remove non-exist subscription", async () => {

  }, 300000)


  test("user not bind beatleader", async () => {

  }, 300000)
})

describe("lightband rank subscription group ", async () => {

})
