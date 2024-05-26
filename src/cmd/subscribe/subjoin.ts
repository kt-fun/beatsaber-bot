import {Context, h, Logger} from "koishi";
import {Config} from "../../config";
import {APIService, RenderService} from "../../service";
export function JoinSubscribeCmd(ctx:Context,cfg:Config,render:RenderService,api:APIService,logger:Logger) {
  const joinCmd = ctx
    .command('bsbot.subscribe.join')
    .alias('bbjoin')
    .userFields(['id'])
    .option('type', '<type:string>')
    .action(async ({ session, options }, input) => {
        if(options.type === "beatleader") {
          const res = await ctx.database.get('BSBotSubscribe', {
            type:'beatleader',
            channelId: session.channelId,
          })
          if(res.length < 1) {
            session.sendQuote(session.text('commands.bsbot.subscribe.join.nosub.beatleader'))
            return
          }
          const data = {
            subscribeId: res[0].id,
            memberUid: session.user.id,
            joinedAt: new Date()
          }
          ctx.database.upsert('BSSubscribeMember', [data])
          session.sendQuote(session.text('commands.bsbot.subscribe.join.success.beatleader'))
        }
        else if(options.type === "beatsaver") {
          const res = await ctx.database.get('BSBotSubscribe', {
            type:'beatsaver',
            channelId: session.channelId,
          })
          if(res.length < 1) {
            session.sendQuote(session.text('commands.bsbot.subscribe.join.nosub.beatsaver'))
            return
          }
          const data = {
            subscribeId: res[0].id,
            memberUid: session.user.id,
            joinedAt: new Date()
          }
          ctx.database.upsert('BSSubscribeMember', [data])
          session.sendQuote(session.text('commands.bsbot.subscribe.join.success.beatsaver'))
        }



    })
  return {
    key: 'subscribe.join',
    cmd: joinCmd
  }
}
