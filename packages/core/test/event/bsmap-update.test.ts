import {afterAll, describe, expect, test} from "vitest";
import { getBeatSaverMapEvent, mockData } from "~/event/bsmap-update.mock";
import fs from "fs";
import {createCtx} from "~/support/create-ctx";

const p = 'test-event-bsmap-update'


afterAll(() => {
  fs.rmdirSync(p, { recursive: true })
})
fs.mkdirSync(p, { recursive: true })
const { testCmd, testEvent, db } = await createCtx(p, mockData)
describe("bsmap-update event", async () => {
  test("should render 2 images", async () => {
    // 3 条生效（2个关联到 member，1个群聊级别生效），指向两个 channel
    const res = await testEvent({
      eventType: 'bsmap-update',
      payload: getBeatSaverMapEvent("58338", '3c770')
    })
    expect(res.length).toEqual(6);
    expect(res[0]).toEqual("events.beatsaver.bsmap.update");
    expect(res[1]).toEqual(expect.stringMatching(/^img-file:/));
    expect(res[2]).toEqual(expect.stringMatching(/^audio-url:/));
    expect(res[3]).toEqual("events.beatsaver.bsmap.update");
    expect(res[4]).toEqual(expect.stringMatching(/^img-file:/));
    expect(res[5]).toEqual(expect.stringMatching(/^audio-url:/));
  })

  test("should render 1 images", async () => {
    // 1 条生效（1个关联到 member），指向 1 个 channel
    const res = await testEvent({
      eventType: 'bsmap-update',
      payload: getBeatSaverMapEvent("41378", '3c77d')
    })
    expect(res.length).toEqual(3);
    expect(res[0]).toEqual("events.beatsaver.bsmap.update");
    expect(res[1]).toEqual(expect.stringMatching(/^img-file:/));
    expect(res[2]).toEqual(expect.stringMatching(/^audio-url:/));
  })

  test("should skip", async () => {
    // 3 条生效（2个关联到 member，1个群聊级别生效），指向两个 channel
    const res = await testEvent({
      eventType: 'bsmap-update',
      payload: getBeatSaverMapEvent("11378", '3c771')
    })
    expect(res.length).toEqual(0);
  })
})
