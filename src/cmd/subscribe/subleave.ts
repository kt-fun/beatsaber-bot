import {$, Command, Context, h} from "koishi";
import {Config} from "../../config";
import {APIService} from "../../service";
export function LeaveSubscribeCmd(ctx:Context,cfg:Config,api:APIService) {

  const leaveCmd = ctx
    .command('bsbot.subscribe.leave')
    .alias('bbleave')
    .userFields(['id'])
    .option('type', '<type:string>')
    .action(async ({ session, options }, input) => {

      const selection = ctx.database.join(['BSBotSubscribe','BSSubscribeMember'])
      const subs = await selection.where(row =>
        $.and(
          $.eq(row.BSBotSubscribe.channelId, session.channelId),
          $.eq(row.BSBotSubscribe.id,row.BSSubscribeMember.subscribeId),
          $.eq(row.BSSubscribeMember.memberUid,session.user.id),
        )
      ).execute()

      if(options.type === "beatleader") {
        const ok = subs.some(it=> it.BSBotSubscribe.type == "beatleader")
        if(!ok) {
          session.sendQuote(session.text('commands.bsbot.subscribe.leave.not-exist.beatleader'))
          return
        }
        const res = subs.find(it=> it.BSBotSubscribe.type == "beatleader")
        await ctx.database.remove('BSSubscribeMember', {
          subscribeId: res.BSBotSubscribe.id,
          memberUid: session.user.id,
        })

        session.sendQuote(session.text('commands.bsbot.subscribe.leave.success.beatleader'))
      } else if(options.type === "beatsaver") {
        const ok = subs.some(it=> it.BSBotSubscribe.type == "beatsaver")
        if(!ok) {

          session.sendQuote(session.text('commands.bsbot.subscribe.leave.not-exist.beatsaver'))
          return
        }
        const res = subs.find(it=> it.BSBotSubscribe.type == "beatsaver")
        await ctx.database.remove('BSSubscribeMember', {
          subscribeId: res.BSBotSubscribe.id,
          memberUid: session.user.id,
        })
        session.sendQuote(session.text('commands.bsbot.subscribe.leave.success.beatsaver'))
      }
    })
  return {
    key: 'subscribe.leave',
    cmd: leaveCmd
  }
}
