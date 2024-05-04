import {Context, h, Logger} from "koishi";
import {Config} from "../config";
import {APIService} from "../service";

export function BindCmd(ctx:Context,cfg:Config,api:APIService, logger:Logger) {
  const bindCmd = ctx
    .command('bsbot.bind <scoresaberId:string>')
    .userFields(['bindSteamId'])
    .alias('bbbind')
    .action(async ({ session, options }, input) => {
      const scoreSaberUser = await api.withRetry(() => api.ScoreSaber.getScoreUserById(input),3)
      if(!scoreSaberUser.isSuccess()) {
        const text = session.text('commands.bsbot.bind.not-found', {id: input, platform:"ScoreSaber"})
        session.send(h('message', h('quote', {id: session.messageId}), text))
        return
      }
      session.sendQueued(h('message',
          h('quote', {id: session.messageId}),
          session.text('commands.bsbot.bind.ack-prompt',{user: `${scoreSaberUser.data.name}(${scoreSaberUser.data.id})`}),
          session.user.bindSteamId ? ","+session.text('commands.bsbot.bind.exist',{id:session.user.bindSteamId}):""
        )
      )
      const prompt = await session.prompt(30000)
      if(!prompt || prompt != 'y' && prompt != 'yes') {
        session.sendQueued(h('message',
          h('quote', {id: session.messageId}),
          prompt?session.text('commands.bsbot.bind.cancel'):session.text('commands.bsbot.bind.timeout')
        ))
        return
      }

      const res = await ctx.database.set("user", session.user["id"],{
        bindSteamId: scoreSaberUser.data.id
      })
      session.sendQueued(
        h('message',
          h('quote', {id: session.messageId}),
          session.text('commands.bsbot.bind.success',{user: `${scoreSaberUser.data.name}(${scoreSaberUser.data.id})`})
        )
      )
    })
  return {
    key: "bind",
    cmd: bindCmd,
  }
}
