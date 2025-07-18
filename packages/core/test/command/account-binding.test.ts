import { users } from "~/support/mock-data";
import {afterAll, assert, describe, expect, test} from "vitest";
import fs from "fs";
import {createCtx} from "~/support/create-ctx";
import {
  AccountNotFoundError, BLAccountNotFoundError,
  BSAccountNotFoundError,
  InvalidParamsError,
  MissingParamsError, SessionPromotionCancelError,
  SessionPromotionTimeoutError, SSAccountNotFoundError
} from "@/services/errors";

const p = 'test-account-binding'
afterAll(() => {
  fs.rmdirSync(p, { recursive: true })
})
fs.mkdirSync(p, { recursive: true })
const { testCmd, testEvent, db } = await createCtx(p)

describe("bind beatsaver account", async () => {
  test("invalid input", async () => {
    const res = await testCmd('bind', {
      sess: { user: users[0] },
      inputs: ["abc", 'y'],
      options: {
        p: 'bs'
      }
    })
    expect(res[0]).toEqual(InvalidParamsError.id);
  }, 300000)

  test("empty input", async () => {
    const res = await testCmd('bind', {
      sess: { user: users[0] },
      options: {
        p: 'bs'
      }
    })
    expect(res[0]).toEqual(MissingParamsError.id);
  }, 300000)

  test("bind non-exist account", async () => {
    const res = await testCmd('bind', {
      sess: { user: users[0] },
      inputs: ["1923839", 'y'],
      options: {
        p: 'bs'
      }
    })
    expect(res[0]).toEqual(BSAccountNotFoundError.id);
  }, 300000)

  test("bind timeout", async () => {
    const res = await testCmd('bind', {
      sess: { user: users[0] },
      inputs: ["58338"],
      options: {
        p: 'bs'
      }
    })
    const [ackPrompt, timeoutMsg] = res
    expect(res.length).toEqual(2);
    expect(ackPrompt).toEqual(expect.stringMatching(/^commands\.bsbot\.bind\.ack-prompt/));
    expect(timeoutMsg).toEqual(SessionPromotionTimeoutError.id);
  }, 300000)

  test("reject bind", async () => {
    const res = await testCmd('bind', {
      sess: { user: users[0] },
      inputs: ["58338", "n"],
      options: {
        p: 'bs'
      }
    })
    const [ackPrompt, cancelMsg] = res
    expect(res.length).toEqual(2);
    expect(ackPrompt).toEqual(expect.stringMatching(/^commands\.bsbot\.bind\.ack-prompt/));
    expect(cancelMsg).toEqual(SessionPromotionCancelError.id);
  }, 300000)

  test("fisrt bind", async () => {
    const user = users[3]
    const { beatsaver: beforeAccount } = await db.getUserAccountsByUserIdAndType(user.id, ['beatsaver'] as const)
    expect(beforeAccount === null || beforeAccount === undefined).toBe(true);
    const res = await testCmd('bind', {
      sess: { user },
      inputs: ["58338", "y"],
      options: {
        p: 'bs'
      }
    })
    const [ackPrompt, msg] = res
    expect(res.length).toEqual(2);
    expect(ackPrompt).toEqual(expect.stringMatching(/^commands\.bsbot\.bind\.ack-prompt/));
    expect(msg).toEqual(expect.stringMatching(/^commands\.bsbot\.bind\.(scoresaber|beatleader|beatsaver)\.success/));
    const { beatsaver: afterAccount } = await db.getUserAccountsByUserIdAndType(user.id, ['beatsaver'] as const)
    expect(afterAccount).toMatchObject({
      userId: user.id,
      providerId: 'beatsaver',
      accountId: '58338',
    });
  }, 300000)


  test("replace previous binding", async () => {
    const user = users[0]

    const { beatsaver: beforeAccount } = await db.getUserAccountsByUserIdAndType(user.id, ['beatsaver'] as const)
    expect(beforeAccount).toMatchObject({
      userId: user.id,
      providerId: 'beatsaver',
      accountId: '58338',
    });
    const res = await testCmd('bind', {
      sess: { user },
      inputs: ["30311", "y"],
      options: {
        p: 'bs'
      }
    })
    const [ackPrompt, msg] = res
    expect(res.length).toEqual(2);
    expect(ackPrompt).toEqual(expect.stringMatching(/^commands\.bsbot\.bind\.ack-prompt/));
    expect(msg).toEqual(expect.stringMatching(/^commands\.bsbot\.bind\.(scoresaber|beatleader|beatsaver)\.success/));
    const { beatsaver: afterAccount } = await db.getUserAccountsByUserIdAndType(user.id, ['beatsaver'] as const)
    expect(afterAccount).toMatchObject({
      userId: user.id,
      providerId: 'beatsaver',
      accountId: '30311',
    });
  }, 300000)
}, 300000)
//

describe("bind beatleader account", async () => {

  test("deafult bind beatleader account", async () => {
    const user = users[3]
    const res = await testCmd('bind', {
      sess: { user },
      inputs: ["1", 'y']
    })
    const [ackPrompt, msg] = res
    expect(res.length).toEqual(2);
    expect(ackPrompt).toEqual(expect.stringMatching(/^commands\.bsbot\.bind\.ack-prompt/));
    expect(msg).toEqual(expect.stringMatching(/^commands\.bsbot\.bind\.(scoresaber|beatleader|beatsaver)\.success/));
    const { beatleader: afterAccount } = await db.getUserAccountsByUserIdAndType(user.id, ['beatleader'] as const)
    expect(afterAccount).toMatchObject({
      userId: user.id,
      providerId: 'beatleader',
      accountId: '76561198059961776',
    });
  }, 300000)

  test("bind error beatleader account", async () => {
    const res = await testCmd('bind', {
      sess: { user: users[0] },
      inputs: ["xava"],
      options: {
        p: 'bl'
      }
    })
    expect(res[0]).toEqual(InvalidParamsError.id);
  }, 300000)
  test("not found beatleader account", async () => {
    const res = await testCmd('bind', {
      sess: { user: users[0] },
      inputs: ["123213123"],
      options: {
        p: 'bl'
      }
    })
    expect(res[0]).toEqual(BLAccountNotFoundError.id);
  }, 300000)

}, 300000)



describe("bind scoresaber account", async () => {

  test("bind scoresaber account", async () => {
    const user = users[3]
    const res = await testCmd('bind', {
      sess: { user },
      inputs: ["76561198059961776", 'y'],
      options: {
        p: 'ss'
      }
    })
    const [ackPrompt, msg] = res
    expect(res.length).toEqual(2);
    expect(ackPrompt).toEqual(expect.stringMatching(/^commands\.bsbot\.bind\.ack-prompt/));
    expect(msg).toEqual(expect.stringMatching(/^commands\.bsbot\.bind\.(scoresaber|beatleader|beatsaver)\.success/));
    const { scoresaber: afterAccount } = await db.getUserAccountsByUserIdAndType(user.id, ['scoresaber'] as const)
    expect(afterAccount).toMatchObject({
      userId: user.id,
      providerId: 'scoresaber',
      accountId: '76561198059961776',
    });
  }, 300000)

  test("bind error scoresaber account", async () => {
    const res = await testCmd('bind', {
      sess: { user: users[0] },
      inputs: ["xava"],
      options: {
        p: 'ss'
      }
    })
    expect(res[0]).toEqual(InvalidParamsError.id);
  }, 300000)

  test("not found scoresaber account", async () => {
    const res = await testCmd('bind', {
      sess: { user: users[0] },
      inputs: ["1292012"],
      options: {
        p: 'ss'
      }
    })
    expect(res[0]).toEqual(SSAccountNotFoundError.id);
  }, 300000)

}, 300000)
