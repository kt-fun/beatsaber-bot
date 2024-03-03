import {Context, h, SessionError} from "koishi";
import {Config} from "../config";
import {bsRequest} from "../utils/bsRequest";
import {scRequest} from "../utils/scRequest";
import handlerError from "../utils/handlerError";

export function BindCmd(ctx:Context,cfg:Config) {
//   me
//   verify

  const bsClient = bsRequest(ctx,cfg)
  const scClient = scRequest(ctx,cfg)
  const bindSubCmd = ctx
    .command('bsbot.bind <id:text>')
    .userFields(['bindId'])
    .alias('bbbind')
    .action(async ({ session, options }, input) => {
      let scoreSaberUser = await handlerError(session,async ()=> await scClient.getScoreUserById(input))
      if(scoreSaberUser === undefined) {
        return
      }
      if (!scoreSaberUser) {
        console.log("notfound")
        const text = session.text('commands.bsbot.bind.not-found', {id: input, platform:"ScoreSaber"})
        session.send(h('message',
          h('quote', {id: session.messageId}),
          text
        ))
        return
      }
      session.send(h('message',
          h('quote', {id: session.messageId}),
          session.text('commands.bsbot.bind.ack-prompt',{user: `${scoreSaberUser.name}(${scoreSaberUser.id})`}),
          session.user.bindId ? "。"+session.text('commands.bsbot.bind.exist',{id:session.user.bindId}):""
        )
      )
      const prompt = await session.prompt(30000)
      if(!prompt || prompt != 'y' && prompt != 'yes') {
        session.send(h('message',
          h('quote', {id: session.messageId}),
          prompt?session.text('commands.bsbot.bind.cancel'):session.text('commands.bsbot.bind.timeout')
        ))
        return
      }

      const res = await ctx.database.set("user", session.user["id"],{
        bindId: scoreSaberUser.id
      })

      session.send(
        h('message',
          h('quote', {id: session.messageId}),
          session.text('commands.bsbot.bind.success',{user: `${scoreSaberUser.name}(${scoreSaberUser.id})`})
        )
      )

    })
}
