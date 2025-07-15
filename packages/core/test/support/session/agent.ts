import type { Channel, PositiveSession } from "@/index";
import {TestPositiveSession} from "./positive-session.js";

export class TestAgentService {

  session: TestPositiveSession

  constructor(private readonly filepath: string) {
  }
  getAgentSessionByChannelInfo(channel: Channel): Promise<PositiveSession> {
    const positive = new TestPositiveSession(this.filepath, {
      channel, lang: 'zh-CN'
    })
    this.session = positive
    return Promise.resolve(positive)
  }
}
