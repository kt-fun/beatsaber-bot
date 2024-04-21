import {Context, h} from "koishi";
import {Config} from "../config";
import {RenderOpts, renderRank, renderScore} from "../img-render";
import {APIService} from "../service";
import {convertDiff} from "../utils/converter";

export function ScoreCmd(ctx:Context,cfg:Config,api:APIService) {
  const scoreCmd = ctx
    .command('bsbot.score')
    .alias('bbscore')
    .userFields(['bindId'])
    .option('p', '<platform:string>')
    .option('d', '<diffculty:string>')
    .option('m', '<mode:string>')
    .action(async ({ session, options }, input) => {
      // use input

      let reg = /^([0-9a-fA-F]{3,5})(<at id="([0-9a-zA-z_]+)"\/>)?$/
      let renderOpts = {
        puppeteer:ctx.puppeteer,
        renderBaseURL: cfg.rankRenderURL,
        onStartRender() {session.send("开始渲染啦，请耐心等待5s")},
        platform:  options.p=='ss'? 'score-saber' : 'beat-leader',
        background: 'default'
      } satisfies RenderOpts
      if(!reg.test(input)){
        if(/^[0-9]+$/.test(input)) {
          const img = await renderScore(input,renderOpts)
          session.send(img)
        }else {
          const res = await session.send(h('message',
            h('quote',{id:session.messageId}),
            session.text('commands.bsbot.score.not-a-score-id')
          ))
        }
        return
      }
      const [full,mapId, at, uid, ,...rest] = reg.exec(input)

      let bindId
      if(!uid) {
        bindId = session.user.bindId
        if(!bindId) {
          session.send(h('message',
            h('quote',{id:session.messageId}),
            session.text('commands.bsbot.score.not-bind')
          ))
          return
        }
      }else {
        const res = await ctx.database.get('binding',{
          platform: session.platform,
          pid: uid
        })
        const aid = res[0]?.aid
        const user =await ctx.database.get('user', {
          id: aid
        })
        if(user.length == 0|| !user[0].bindId) {
          session.send(h('message',
            h('quote',{id:session.messageId}),
            session.text('commands.bsbot.score.who-not-bind')
          ))
          return
        }
        bindId = user[0].bindId
      }

      let diffOption
      if(options.d || options.m) {
        diffOption = {
          difficulty: convertDiff(options.d),
          mode: options.m
        }
      }
      const score = await api.BeatLeader.getScoreByPlayerIdAndMapId(bindId, mapId, diffOption)
      if (!score) {
        return session.text('commands.bsbot.score.score-not-found',{user: bindId, id: mapId})
      }
      const img = await renderScore(score.id.toString(), renderOpts)
      session.send(img)

    })

}
