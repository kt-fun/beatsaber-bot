import {Context, Logger} from "koishi";
import {Config} from "../config";
import {APIService} from "../service";

export function HelpCmd(ctx:Context,cfg:Config,api:APIService,logger:Logger) {
  const cmpcmd = ctx
    .command('bsbot.help')
    .alias('bbhelp')
    .action(async ({ session, options }, input) => {
    //   todo
      // send a help img
      session.send("still working on")
    })
}
