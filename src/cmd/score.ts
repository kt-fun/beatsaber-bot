import {Context} from "koishi";
import {Config} from "../config";
import {RenderOpts, renderScore} from "../img-render";
import {APIService} from "../service";

export function ScoreCmd(ctx:Context,cfg:Config,api:APIService) {
  const scoreCmd = ctx
    .command('bsbot.score')
    .alias('bbscore')
    .option('p', '<platform:string>')
    .action(async ({ session, options }, input) => {
      let renderOpts = {
        renderBaseURL: cfg.rankRenderURL,
        platform: options.p=='ss'?'score-saber':'beat-leader',
        onStartRender() {
          session.send("开始渲染啦，请耐心等待 5s")
        },
        puppeteer:ctx.puppeteer,
        background: 'default'
      } satisfies RenderOpts
       const img = await renderScore(input,renderOpts)
      session.send(img)
    })

}
