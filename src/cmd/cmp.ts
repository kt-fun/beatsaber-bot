import {Context, h} from "koishi";
import {Config} from "../config";
import {bsRequest} from "../utils/bsRequest";

export function CmpCmd(ctx:Context,cfg:Config) {
  const bsClient = bsRequest(ctx,cfg)
  const cmpcmd = ctx
    .command('bsbot.cmp')
    .alias('bbcmp')
    .action(async ({ session, options }, input) => {
      session.send("still working")
    })

}
