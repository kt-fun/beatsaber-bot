import {afterAll, describe, expect, test} from "vitest";
import fs from "fs";
import {createCtx} from "~/support/create-ctx";
import {getBeatleaderScoreEvent, mockData} from "./blscore-update.mock";

const p = 'test-event-blscore-update'
afterAll(() => {
  fs.rmdirSync(p, { recursive: true })
})
fs.mkdirSync(p, { recursive: true })


const { testCmd, testEvent, db } = await createCtx(p, mockData)


describe("blscore-update event", async () => {
  test("should render 1 images, 1 member, 1 channel", async () => {
    // 2 条生效（2个关联到 member），指向两个 channel
    const res = await testEvent({
      eventType: 'blscore-update',
      payload: getBeatleaderScoreEvent("76561198960449289")
    })
    expect(res.length).toEqual(2);
    expect(res[0]).toEqual("events.beatleader.score.update");
    expect(res[1]).toEqual(expect.stringMatching(/^img-file:/));
  }, 300000)
  test("should render 2 images, 2 member subscription", async () => {
    const res = await testEvent({
      eventType: 'blscore-update',
      payload: getBeatleaderScoreEvent("1922350521131465")
    })
    expect(res.length).toEqual(4);
    expect(res[0]).toEqual("events.beatleader.score.update");
    expect(res[1]).toEqual(expect.stringMatching(/^img-file:/));
    expect(res[2]).toEqual("events.beatleader.score.update");
    expect(res[3]).toEqual(expect.stringMatching(/^img-file:/));
  }, 300000)

  test("should render 0 images", async () => {
    const res = await testEvent({
      eventType: 'blscore-update',
      payload: getBeatleaderScoreEvent("230")
    })
    expect(res.length).toEqual(0);
  })
})
