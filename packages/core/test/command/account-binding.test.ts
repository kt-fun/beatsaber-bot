import {channels, users} from "../mock/data.js";
import {afterAll} from "vitest";
import fs from "fs";

const defaultSess = {
  user: users[0],
  channel: channels[0],
  mentions: [],
  locale: 'zh-CN'
}
const p = 'test-account-binding'
afterAll(() => {
  fs.rmdirSync(p, { recursive: true })
})
fs.mkdirSync(p, { recursive: true })
