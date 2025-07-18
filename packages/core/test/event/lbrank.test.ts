import {afterAll, describe, expect, test} from "vitest";
import fs from "fs";
import {createCtx} from "~/support/create-ctx";
import {mockData} from "./lbrank.mock";

const p = 'test-event-lbrank'
afterAll(() => {
  fs.rmdirSync(p, { recursive: true })
})
fs.mkdirSync(p, { recursive: true })


const { testCmd, testEvent, db } = await createCtx(p, mockData)


describe("lbrank event", async () => {
  test("trigger lbrank event", async () => {
    const now = new Date()
    const res = await testEvent({
      eventType: 'lbrank',
      payload: now
    })
    expect(res[0]).toEqual(expect.stringMatching(/^img-file:/));
    expect(res[1]).toEqual(expect.stringMatching(/^img-file:/));
    expect(res[2]).toEqual(expect.stringMatching(/^img-file:/));
    expect(res[3]).toEqual(expect.stringMatching(/^img-file:/));
  }, 500000)
})
