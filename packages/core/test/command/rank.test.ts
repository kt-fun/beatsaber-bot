// 未启用 i18n， render service mock
import {afterAll, describe, expect, test} from "vitest";
import fs from "fs";
import {createCtx} from "../support/create-ctx.js";
import {channels, users} from "../mock/data.js";

const defaultSess = {
  user: users[0],
  channel: channels[0],
  mentions: [],
  locale: 'zh-CN'
}

describe("command rank", async () => {
  const p = 'test-rank'
  afterAll(() => {
    fs.rmdirSync(p, { recursive: true })
  })
  fs.mkdirSync(p, { recursive: true })
  const { testCmd, testEvent } = await createCtx(p, defaultSess)


  test("rank render a img", async () => {
    const res = await testCmd('rank', {inputs: ['1922350521131465']})
    expect(res).toEqual(expect.arrayContaining([
      expect.stringMatching(/^img-file:/)
    ]));
  }, 300000)

  // todo fix 404
  test("rank throw unknown error", async () => {
    const res = await testCmd('rank', {inputs: ['-1']})
    expect(res).toEqual(expect.arrayContaining([
      'command.error.unknown-error'
    ]));
  }, 300000)


}, 300000)
