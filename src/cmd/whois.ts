import {Context, h, Logger} from "koishi";
import {Config} from "../config";
import {RenderOpts, renderRank} from "../img-render";
import {APIService} from "../service";

export function WhoisCmd(ctx:Context,cfg:Config,api:APIService,logger:Logger) {

  const rankSubCmd = ctx
    .command('bsbot.who')
    .userFields(['bindSteamId'])
    .alias('bbwho')
    .alias('bbwhoss', {options: {p: "ss"}})
    .alias('bbwhobl', {options: {p: "bl"}})
    .alias('sswho', {options: {p: "ss"}})
    .alias('blwho', {options: {p: "bl"}})
    .alias('!whos', {options: {p: "ss"}})
    .alias('!whob', {options: {p: "bl"}})
    .alias('iwhos', {options: {p: "ss"}})
    .alias('iwhob', {options: {p: "bl"}})
    .option('p', '<platform:string>')
    .action(async ({ session, options }, input) => {
      let reg = /<at id="([0-9a-zA-z]+)"\/>/
      if(!reg.test(input)){
        session.sendQueued(h('message',
          h('quote',{id:session.messageId}),
          session.text('commands.bsbot.who.need-at')
        ))
        return
      }
      const [full,platformId,] = reg.exec(input)
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
      if(user.length == 0|| !user[0].bindSteamId) {
        session.send(h('message',
          h('quote',{id:session.messageId}),
          session.text('commands.bsbot.who.not-bind')
        ))
        return
      }
      let rankOps = {
        puppeteer:ctx.puppeteer,
        renderBaseURL: cfg.remoteRenderURL,
        waitTimeout: 5000,
        onStartRender() {session.send(session.text('common.render.wait', {sec:5}))},
        platform:  options.p=='ss'? 'score-saber' : 'beat-leader',
        background: 'default'
      } satisfies RenderOpts
      const img = await renderRank(user[0].bindSteamId, rankOps)
      session.sendQueued(img)
    })
}
