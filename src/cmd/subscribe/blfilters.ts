import {$, Context, h, Logger} from "koishi";
import {Config} from "../../config";
import {APIService} from "../../service";
import {alert} from "./alert";
import {beatsaver} from "./beatsaver";
import {beatleader} from "./beatleader";
import {BLScoreFilter} from "../../types/beatleader-condition";



// manage bl filter condition
export function BLFilterCmd(ctx:Context,cfg:Config,api:APIService,logger:Logger) {
  const filterCmd = ctx
    .command('bsbot.subscribe.filter')
    .alias('bbfilter')
    .userFields(['id'])
    .option('type', '<type:string>')
    .action(async ({ session, options }, input) => {
      if(options.type === "beatleader") {
      //   check uid, check channel subscribe
        const channelSub = await ctx.database.get('BSBotSubscribe', {
          channelId: session.channelId,
          type: 'beatleader',
        })
        const channelFilter = channelSub[0].data as BLScoreFilter
        if(channelSub.length < 0) {
          session.sendQuote(session.text("commands.bsbot.subscribe.filter.bl.channel-no-sub"))
        }
        const ops = await session.prompt(30000)
        // d1
        // d2
        // d3
        // update rank only
        // update channel filter
        // update member filter
        // 当前筛选器
        // params
        session.channelId

      }

    })
  return {
    key: 'subscribe.filter',
    cmd: filterCmd
  }
}
