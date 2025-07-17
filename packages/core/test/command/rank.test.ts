// 未启用 i18n， render service mock
import {afterAll, describe, expect, test} from "vitest";
import fs from "fs";
import {createCtx} from "~/support/create-ctx";
import {channels, users} from "~/support/mock-data";
import {AccountBindingNotFoundError, BLAccountNotFoundError, SSAccountNotFoundError} from "@/services/errors";

const p = 'test-rank'
afterAll(() => {
  fs.rmdirSync(p, { recursive: true })
})
fs.mkdirSync(p, { recursive: true })
const { testCmd, testEvent } = await createCtx(p)



describe("render by id", async () => {
  test("should render beatleader img", async () => {
    const res = await testCmd('rank', {inputs: ['1922350521131465']})
    expect(res).toEqual(expect.arrayContaining([
      expect.stringMatching(/^img-file:/)
    ]));
  }, 300000)

  test("should render scoresaber img", async () => {
    const res = await testCmd('rank', {
      inputs: ['2169974796454690'],
      options: {
        p: 'ss'
      }
    })
    expect(res).toEqual(expect.arrayContaining([
      expect.stringMatching(/^img-file:/)
    ]));
  }, 300000)

  // todo fix 404
  test("should throw bl account not found error", async () => {
    const [res] = await testCmd('rank', {inputs: ['-1']})
    expect(res).toEqual(BLAccountNotFoundError.id);
  }, 300000)

  test("should throw ss account not found error", async () => {
    const [res] = await testCmd('rank', {
      inputs: ['-1'],
      options: {
        p: 'ss'
      }
    })
    expect(res).toEqual(SSAccountNotFoundError.id);
  }, 300000)


}, 300000)


describe("render by user", async () => {
  // 用户1， 绑定了两个平台的账号（beatleader, scoresaber）
  test("should render 2 images", async () => {
    const res1 = await testCmd('rank', {
      sess: {
        user: users[0]
      }
    })
    expect(res1).toEqual(expect.arrayContaining([expect.stringMatching(/^img-file:/)]))
    const res2 = await testCmd('rank', {
      sess: { user: users[0] },
      options: { p: 'ss' }
    })
    expect(res2).toEqual(expect.arrayContaining([expect.stringMatching(/^img-file:/)]))
  }, 300000)

  // 用户 2，绑定单平台
  test("should render 2 images, only bind one platform", async () => {
    // 在未指定平台的情况下，会自适应
    const res1 = await testCmd('rank', {
      sess: { user: users[1] }
    })
    expect(res1).toEqual(expect.arrayContaining([expect.stringMatching(/^img-file:/)]))
    const res2 = await testCmd('rank', {
      sess: { user: users[1] },
      options: { p: 'bl' }
    })
    expect(res2).toEqual(expect.arrayContaining([AccountBindingNotFoundError.id]))
    const res3 = await testCmd('rank', {
      sess: { user: users[1] },
      options: { p: 'ss' }
    })
    expect(res3).toEqual(expect.arrayContaining([expect.stringMatching(/^img-file:/)]))
  }, 300000)

  // 用户 4 未绑定任何平台
  test("should render nothing", async () => {
    const res1 = await testCmd('rank', {
      sess: { user: users[3] }
    })
    expect(res1).toEqual(expect.arrayContaining([AccountBindingNotFoundError.id]))
    const res2 = await testCmd('rank', {
      sess: { user: users[3] },
      options: { p: 'ss' }
    })
    expect(res2).toEqual(expect.arrayContaining([AccountBindingNotFoundError.id]))
  }, 300000)
})


describe("render by mention", async () => {
  // 用户1， 绑定了两个平台的账号（beatleader, scoresaber）
  // 用户2,3 均只绑定了 beatleader, scoresaber 其中一个平台
  test("should render image", async () => {
    const res1 = await testCmd('rank', {
      sess: {
        user: users[0],
        mentions: [users[1]]
      }
    })
    const res2 = await testCmd('rank', {
      sess: {
        user: users[0],
        mentions: [users[2]]
      }
    })
    expect(res1).toEqual(expect.arrayContaining([expect.stringMatching(/^img-file:/)]))
    expect(res2).toEqual(expect.arrayContaining([expect.stringMatching(/^img-file:/)]))
  }, 300000)


  // 用户 4 没有绑定任何平台
  test("should throw account bind not found error", async () => {
    const res = await testCmd('rank', {
      sess: {
        user: users[0],
        mentions: [users[3]]
      }
    })
    expect(res).toEqual(expect.arrayContaining([AccountBindingNotFoundError.id]))
  }, 300000)
})
