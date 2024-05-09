import {Context, h, Logger} from "koishi";
import {Config} from "../config";
import {APIService} from "../service";

export function HelpCmd(ctx:Context,cfg:Config,api:APIService,logger:Logger) {
  const cmpcmd = ctx
    .command('bsbot.help')
    .alias('bbhelp')
    .alias('!help')
    .action(async ({ session, options }, input) => {
      await session.sendQueued(h('image', {
        src: 'https://tmp-r2.ktlab.io/bsbot.basic.v0.1.0.png'
      }))
      await session.sendQueued(h('image', {
        src: 'https://tmp-r2.ktlab.io/bsbot.sub.v0.1.0.png'
      }))
    })
}
