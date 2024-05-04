import {Context, h, Logger} from "koishi";
import {Config} from "../config";
import {APIService} from "../service";

export function CmpCmd(ctx:Context,cfg:Config,api:APIService,logger:Logger) {
  const cmpcmd = ctx
    .command('bsbot.cmp')
    .alias('bbcmp')
    .action(async ({ session, options }, input) => {
      // 1. @someone
      // 2. mapId/Hash
      // 3. me
      session.send("still working on")
    })
}
