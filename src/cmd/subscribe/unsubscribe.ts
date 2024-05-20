import {Context, h} from "koishi";
import {Config} from "../../config";
import {APIService} from "../../service";

export function UnSubscribeCmd(ctx:Context,cfg:Config,api:APIService) {
  const unsub = ctx
    .command('bsbot.unsubscribe')
    .alias('bbunsub')
    .option('type', '<type:string>')
    .action(async ({ session, options }, input) => {
      if(options.type === "beatleader") {
        const res = await ctx.database.get('BSBotSubscribe', {
          type:'beatleader',
          channelId: session.channelId,
        })
        if(res.length < 1) {
          session.sendQuote(session.text('commands.bsbot.unsubscribe.nosub.beatleader'))
          return
        }
        const sub = res[0]
        let data = {...sub, enable: false}
        await ctx.database.upsert('BSBotSubscribe', [data])
        session.sendQuote(session.text('commands.bsbot.unsubscribe.success.beatleader'))
      }

      else if(options.type === "beatsaver") {
        const res = await ctx.database.get('BSBotSubscribe', {
          type:'beatsaver',
          channelId: session.channelId,
        })

        if(res.length < 1) {
          session.sendQuote(session.text('commands.bsbot.unsubscribe.nosub.beatsaver'))
          return
        }
        const sub = res[0]
        let data = {...sub, enable: false}
        await ctx.database.upsert('BSBotSubscribe', [data])

        session.sendQuote(session.text('commands.bsbot.unsubscribe.success.beatsaver'))
      } else if(options.type === "alert") {
        const res = await ctx.database.get('BSBotSubscribe', {
          type:'alert',
          channelId: session.channelId,
        })

        if(res.length < 1) {
          session.sendQuote(session.text('commands.bsbot.unsubscribe.nosub.alert'))
          return
        }
        await ctx.database.remove('BSBotSubscribe', {
          channelId: session.channelId,
          id: res[0].id,
          type:'alert',
        })
        session.sendQuote(session.text('commands.bsbot.unsubscribe.success.alert'))
      }
    })
  return {
    key: 'unsubscribe',
    cmd: unsub
  }
}
