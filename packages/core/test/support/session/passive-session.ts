import type { PassiveSession, User } from "@/index";
import {Options, TestSession} from "./session";

export class TestPassiveSession extends TestSession implements PassiveSession {
  index: number = 0
  user: User
  mentions: User[] = []
  constructor(filepath: string, private inputs: string[], opts: Options & {user?: User, mentions?: User[]}) {
    super(filepath, opts);
    this.user = opts.user
    this.mentions = opts.mentions
  }
  override prompt(timeout?: number): Promise<string> {
    return Promise.resolve(this.inputs[this.index++])
  }
}
