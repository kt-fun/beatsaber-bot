import {Context, h} from "koishi";
import {Config} from "../config";
import {RenderOpts, renderRank} from "../img-render";
import {APIService} from "../service";

export function WhoisCmd(ctx:Context,cfg:Config,api:APIService) {

  const rankSubCmd = ctx
    .command('bsbot.who')
    .userFields(['bindId'])
    .alias('bbwho')
    .option('p', '<platform:string>')
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
      let rankOps = {
        puppeteer:ctx.puppeteer,
        renderBaseURL: cfg.rankRenderURL,
        onStartRender() {session.send("开始渲染啦，请耐心等待5s")},
        platform:  options.p=='ss'? 'score-saber' : 'beat-leader',
        background: 'default'
      } satisfies RenderOpts
      const img = await renderRank(user[0].bindId, rankOps)
      session.send(img)
    })
}
