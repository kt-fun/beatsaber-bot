import {Context} from "koishi";
import {Config} from "../config";
import {RenderOpts, renderRank} from "../img-render";
import {APIService} from "../service";

export function RankCmd(ctx: Context, cfg: Config,api:APIService) {
  const newsubcmd = ctx
    .command('bsbot.rank <uid:text>')
    .alias('bbrank')
    .option('p', '<platform:string>')
    .action(async ({session, options}, input) => {
      let rankOps = {
        puppeteer:ctx.puppeteer,
        renderBaseURL: cfg.rankRenderURL,
        onStartRender() {session.send("开始渲染啦，请耐心等待5s")},
        platform:  options.p=='ss'? 'score-saber' : 'beat-leader',
        background: 'default'
      } satisfies RenderOpts
      const img = await renderRank(input, rankOps)
      session.send(img)
    })

}
