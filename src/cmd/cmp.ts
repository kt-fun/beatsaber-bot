import {Context, h} from "koishi";
import {Config} from "../config";
import {APIService} from "../service";

export function CmpCmd(ctx:Context,cfg:Config,api:APIService) {
  const cmpcmd = ctx
    .command('bsbot.cmp')
    .alias('bbcmp')
    .action(async ({ session, options }, input) => {
      session.send("still working")
    })

}
