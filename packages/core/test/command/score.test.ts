import {describe, expect, assert, test, afterAll} from "vitest";
import {createCtx} from "../support/create-ctx.js";
import {channels, users} from "../mock/data.js";
import fs from "fs";

const defaultSess = {
  user: users[0],
  channel: channels[0],
  mentions: [],
  locale: 'zh-CN'
}
const p = 'test-score'
afterAll(() => {
  fs.rmdirSync(p, { recursive: true })
})
fs.mkdirSync(p, { recursive: true })
const { testCmd, testEvent } = await createCtx(p, defaultSess)
// only beatleader
describe("render score(map id) by user", async () => {

  test("should render image", async () => {
    const res = await testCmd('score', {
      sess: {
        user: users[0],
      },
      inputs: ['3c0be'],
    })
    expect(res).toEqual(expect.arrayContaining([
      expect.stringMatching(/^img-file:/)
    ]));
  }, 300000)

  test("score not found", async () => {
    const res = await testCmd('score', {
      sess: {
        user: users[0],
      },
      inputs: ['4899e'],
    })
    expect(res).toEqual(expect.arrayContaining([
      "commands.bsbot.score.score-not-found"
    ]));
  }, 300000)


  test("user not bind beatleader", async () => {
    const res = await testCmd('score', {
      sess: {
        user: users[3],
      },
      inputs: ['4899e'],
    })
    expect(res).toEqual(expect.arrayContaining([
      "commands.bsbot.score.not-bind"
    ]));
  }, 300000)
})


describe("render score(map id) by mention", async () => {

  test("should render image", async () => {
    const res = await testCmd('score', {
      sess: {
        user: users[3],
        mentions: [users[0]]
      },
      inputs: ['3c0be'],
    })
    expect(res).toEqual(expect.arrayContaining([
      expect.stringMatching(/^img-file:/)
    ]));
  }, 300000)

  test("score not found", async () => {
    const res = await testCmd('score', {
      sess: {
        user: users[3],
        mentions: [users[0]]
      },
      inputs: ['4899e'],
    })
    expect(res).toEqual(expect.arrayContaining([
      "commands.bsbot.score.score-not-found"
    ]));
  }, 300000)

  test("user not bind beatleader", async () => {
    const res = await testCmd('score', {
      sess: {
        user: users[0],
        mentions: [users[3]]
      },
      inputs: ['4899e'],
    })
    expect(res).toEqual(expect.arrayContaining([
      "commands.bsbot.score.not-bind"
    ]));
  }, 300000)
})
