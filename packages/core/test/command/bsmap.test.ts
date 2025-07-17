import {afterAll, assert, describe, expect, test} from "vitest";
import fs from "fs";
import {createCtx} from "~/support/create-ctx";
import {BSMapNotFoundError, InvalidParamsError} from "@/services/errors";

const p = 'test-bsmap'
afterAll(() => {
  fs.rmdirSync(p, { recursive: true })
})
fs.mkdirSync(p, { recursive: true })
const { testCmd, testEvent } = await createCtx(p)

describe("bsmap latest", async () => {
  test("should return 3 maps", async () => {
    const res: string[] = await testCmd('latest')
    const [info, ...maps] = res
    expect(info).toEqual("commands.bsbot.latest.info");
    expect(maps.length).toEqual(6)
    expect(maps[0]).toEqual(expect.stringMatching(/^img-file:/))
    expect(maps[2]).toEqual(expect.stringMatching(/^img-file:/))
    expect(maps[4]).toEqual(expect.stringMatching(/^img-file:/))
    expect(maps[1]).toEqual(expect.stringMatching(/^audio-url:/))
    expect(maps[3]).toEqual(expect.stringMatching(/^audio-url:/))
    expect(maps[5]).toEqual(expect.stringMatching(/^audio-url:/))
  }, 300000)

  test("should return 1 maps", async () => {
    const res: string[] = await testCmd('latest', {
      options: {
        s: 1
      }
    })
    const [info, ...maps] = res
    expect(info).toEqual("commands.bsbot.latest.info");
    expect(maps.length).toEqual(2)
    expect(maps[0]).toEqual(expect.stringMatching(/^img-file:/))
    expect(maps[1]).toEqual(expect.stringMatching(/^audio-url:/))
  }, 300000)

  test("should return invalid params error", async () => {
    const res: string[] = await testCmd('latest', {
      options: {
        s: 'd1s'
      }
    })
    expect(res.length).toEqual(1);
    expect(res[0]).toEqual(InvalidParamsError.id);
  }, 300000)
})


describe("bsmap keyword search", async () => {
  test("return empty input", async () => {
    const res: string[] = await testCmd('search')
    expect(res[0]).toEqual("commands.bsbot.search.success");
  }, 300000)

  test("should return 1 map", async () => {
    const res: string[] = await testCmd('search', {
      inputs: ['t1'],
    })
    expect(res[0]).toEqual("commands.bsbot.search.success");
  }, 300000)

  test("should return 0 map", async () => {
    const res: string[] = await testCmd('search', {
      inputs: ['fffdsx'],
    })
    expect(res[0]).toEqual("commands.bsbot.search.not-found");
  }, 300000)
})


describe("bsmap id search", async () => {
  test("return empty", async () => {
    const res: string[] = await testCmd('id')
    expect(res[0]).toEqual(InvalidParamsError.id);
  }, 300000)

  test("should return 1 map", async () => {
    const res: string[] = await testCmd('id', {
      inputs: ['3a667'],
    })
    expect(res[0]).toEqual(BSMapNotFoundError.id);
  }, 300000)
  test("should return error", async () => {
    const res1: string[] = await testCmd('id', {
      inputs: ['t1'],
    })
    expect(res1[0]).toEqual(InvalidParamsError.id);
    const res2: string[] = await testCmd('id', {
      inputs: ['3a66z'],
    })
    expect(res2[0]).toEqual(InvalidParamsError.id);
  }, 300000)
})
