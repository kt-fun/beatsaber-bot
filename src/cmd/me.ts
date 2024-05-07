import {Context, Logger} from "koishi";
import {Config} from "../config";
import {RenderOpts, renderRank, renderScore} from "../img-render";
import {APIService} from "../service";
import {convertDiff} from "../utils/converter";


export function MeCmd(ctx:Context,cfg:Config,api:APIService,logger:Logger) {
  const rankSubCmd = ctx
    .command('bsbot.me [mapId:string]')
    .userFields(['bindSteamId'])
    .alias('bbme')
    .option('p', '[platform:string]')
    .option('d', '[diffculty:string]')
    .option('m', '[mode:string]')
    .action(async ({ session, options }, input) => {
      const bindId = session.user.bindSteamId
      if (!bindId) {
        session.send(session.text('commands.bsbot.me.not-found'))
        return
      }

      let renderOpts = {
        puppeteer:ctx.puppeteer,
        renderBaseURL: cfg.remoteRenderURL,
        onStartRender() {session.send("开始渲染啦，请耐心等待5s")},
        platform:  options.p=='ss'? 'score-saber' : 'beat-leader',
        background: 'default'
      } as RenderOpts
      if(input && input !== "") {
        let diffOption
        if(options.d || options.m) {
          diffOption = {
            difficulty: convertDiff(options.d),
            mode: options.m
          }
        }
        const scoreReq = await api.BeatLeader.getScoreByPlayerIdAndMapId(bindId, input, diffOption)
        if(!scoreReq.isSuccess()) {
          return session.text('commands.bsbot.me.score-not-found',{user: bindId, id: input})
        }
        const img = await renderScore(scoreReq.data.id.toString(), renderOpts)
        session.send(img)
      }else {
        const img = await renderRank(bindId,renderOpts)
        session.send(img)
      }
    })
}
