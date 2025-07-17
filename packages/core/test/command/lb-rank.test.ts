import {describe, expect, assert, test, afterAll} from "vitest";
import {createCtx} from "~/support/create-ctx";
import fs from "fs";

const p = 'test-lb'
afterAll(() => {
  fs.rmdirSync(p, { recursive: true })
})
fs.mkdirSync(p, { recursive: true })
const { testCmd, testEvent } = await createCtx(p)


describe("command lightband rank", async () => {
  test("should render image", async () => {
    const res = await testCmd('lb')
    assert.include(res, 'commands.bsbot.lbrank.render.rank-start', '触发渲染启动消息1')
    assert.include(res, 'commands.bsbot.lbrank.render.score-start', '触发渲染启动消息2')
    expect(res).toEqual(expect.arrayContaining([
      expect.stringMatching(/^img-file:/)
    ]));
  }, 300000)
})
