import {$, Context, h, Logger} from "koishi";
import { Config } from "../../config";
import { APIService } from "../../service";
import {alert} from './alert'
import {beatleader} from "./beatleader";
import {beatsaver} from "./beatsaver";
export {LeaveSubscribeCmd} from "./subleave";
export { UnSubscribeCmd } from './unsubscribe'
export {JoinSubscribeCmd} from './subjoin'


export function SubscribeCmd(ctx:Context,cfg:Config,api:APIService,logger:Logger) {
  const subcmd = ctx
    .command('bsbot.subscribe')
    .alias('bbsub')
    .userFields(['id'])
    .option('type', '<type:string>')
    .action(async ({ session, options }, input) => {
      // check admin permission
      if(options.type === "beatsaver-alert") {
        return alert(ctx, api, { session, options }, input, logger)
      }

      if(options.type === "beatsaver") {
        return beatsaver(ctx, api, { session, options }, input)
      }

      if(options.type === "beatleader") {
        return beatleader(ctx, api, { session, options }, input)
      }


      const uid = session.user.id
      const jointable = ctx.database.join(['BSBotSubscribe','BSSubscribeMember'])
      const rows = await jointable.where(row=>
        $.and(
          $.eq(row.BSBotSubscribe.id,row.BSSubscribeMember.subscribeId),
          $.eq(row.BSBotSubscribe.channelId,session.channelId),
        ))
        .groupBy(['BSBotSubscribe.id'], {
          subscribe : row=> row.BSBotSubscribe,
          members: row=> $.count(row.BSSubscribeMember),
          me: row=> $.in(uid,$.array(row.BSSubscribeMember.memberUid)),
        })
        .execute()
      if(rows.length < 1) {
        session.sendQuote(session.text('commands.bsbot.subscribe.info.none'))
        return
      }
      let text = session.text('commands.bsbot.subscribe.info.header')
      for (const row of rows) {
        text += session.text('commands.bsbot.subscribe.info.body-item',{
          type: row.subscribe.type,
          cnt: row.members
        })
        if(row.me) {
          text += session.text('commands.bsbot.subscribe.info.body-item-include-you')
        }
        text += '\n\n'
      }
      session.sendQueued(h('message', [h('quote', {id: session.messageId}), text]))
    })
  return {
    key: 'subscribe',
    cmd: subcmd
  }
}
