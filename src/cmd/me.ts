import {Context} from "koishi";
import {Config} from "../config";
import {RenderOpts, renderRank, renderScore} from "../img-render";
import {APIService} from "../service";
import {convertDiff} from "../utils/converter";


export function MeCmd(ctx:Context,cfg:Config,api:APIService) {
  const rankSubCmd = ctx
    .command('bsbot.me [mapId:text]')
    .userFields(['bindId'])
    .alias('bbme')
    .shortcut(/(^[0-9a-fA-F]{3,5}$)/, { args: ['$1'] })
    .option('p', '<platform:string>')
    .option('d', '<diffculty:string>')
    .option('m', '<mode:string>')
    .action(async ({ session, options }, input) => {
      const bindId = session.user.bindId
      console.log(bindId)
      if (!bindId) {
        session.send(session.text('commands.bsbot.me.not-found'))
        return
      }
      let renderOpts = {
        puppeteer:ctx.puppeteer,
        renderBaseURL: cfg.rankRenderURL,
        onStartRender() {session.send("开始渲染啦，请耐心等待5s")},
        platform:  options.p=='ss'? 'score-saber' : 'beat-leader',
        background: 'default'
      } satisfies RenderOpts
      if(input && input != "") {
        let diffOption
        if(options.d || options.m) {
          diffOption = {
            difficulty: convertDiff(options.d),
            mode: options.m
          }
        }
        const score = await api.BeatLeader.getScoreByPlayerIdAndMapId(bindId, input, diffOption)
        if (!score) {
          return session.text('commands.bsbot.me.score-not-found',{user: bindId, id: input})
        }
        const img = await renderScore(score.id.toString(), renderOpts)
        session.send(img)
      }else {
        const img = await renderRank(bindId,renderOpts)
        session.send(img)
      }
    })
}
