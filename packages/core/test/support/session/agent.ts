import type { Channel, PositiveSession } from "@/index";
import {TestPositiveSession} from "./positive-session.js";

export class TestAgentService {

  session: TestPositiveSession

  constructor(private readonly filepath: string) {
  }
  getAgentSessionByChannelInfo(channel: Channel): Promise<PositiveSession> {
    if (!this.session) {
      this.session = new TestPositiveSession(this.filepath, {
        channel, lang: 'zh-CN'
      })
    }
    return Promise.resolve(this.session)
  }
}
