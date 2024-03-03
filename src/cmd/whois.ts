import {Context, h} from "koishi";
import {Config} from "../config";
import {bsRequest} from "../utils/bsRequest";
import {scRequest} from "../utils/scRequest";
import {renderRank} from "./rank";

export function WhoisCmd(ctx:Context,cfg:Config) {

  const bsClient = bsRequest(ctx,cfg)
  const scClient = scRequest(ctx,cfg)
  const rankSubCmd = ctx
    .command('bsbot.who')
    .userFields(['bindId'])
    .alias('bbwho')
    .action(async ({ session, options }, input) => {
      let reg = /<at id="([0-9a-zA-z]+)"\/>/
      if(!reg.test(input)){
        session.send(h('message',
          h('quote',{id:session.messageId}),
          session.text('commands.bsbot.who.need-at')
        ))
        return
      }
      const platformId = reg.exec(input)[1]
      const res = await ctx.database.get('binding',{
        platform: session.platform,
        pid: platformId
      })
      if(res.length == 0) {
        session.send(h('message',
          h('quote',{id:session.messageId}),
          session.text('commands.bsbot.who.not-bind')
        ))
        return
      }

      const aid = res[0].aid
      const user =await ctx.database.get('user', {
        id: aid
      })
      if(user.length == 0|| !user[0].bindId) {
        session.send(h('message',
          h('quote',{id:session.messageId}),
          session.text('commands.bsbot.who.not-bind')
        ))
        return
      }
      renderRank(session, user[0].bindId,ctx,cfg)
    })
}
