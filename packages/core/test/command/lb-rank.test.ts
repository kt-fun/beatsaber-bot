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
