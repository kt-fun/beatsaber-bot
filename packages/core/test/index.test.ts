import {describe, expect, assert, test, afterAll, beforeAll} from "vitest";
import {createCtx} from "./support/create-ctx.js";
import {channels, users} from "./mock/data.js";
import fs from "fs";


const defaultSess = {
  user: users[0],
  channel: channels[0],
  mentions: [],
  locale: 'zh-CN'
}


describe("command lb", async () => {

  const p = 'test-lb'
  afterAll(() => {
    fs.rmdirSync(p, { recursive: true })
  })
  fs.mkdirSync(p, { recursive: true })
  const { testCmd, testEvent } = await createCtx(p, defaultSess)
  test("lightband rank should render image as expect", async () => {
    const res = await testCmd('lb')
    assert.include(res, '开始渲染砍击榜了，请耐心等待', '触发渲染启动消息1')
    assert.include(res, '开始渲染分数榜了，请耐心等待', '触发渲染启动消息2')
    expect(res).toEqual(expect.arrayContaining([
      expect.stringMatching(/^img-file:/)
    ]));
  }, 300000)

})

// 未启用 i18n， render service mock
describe("command rank", async () => {
  const p = 'test-rank'
  // 每个都需要注入 cmd
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
