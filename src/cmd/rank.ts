import {Context, Logger, SessionError} from "koishi";
import {Config} from "../config";
import {RenderOpts, renderRank} from "../img-render";
import {APIService} from "../service";

export function RankCmd(ctx: Context, cfg: Config,api:APIService,logger:Logger) {
  const rankCmd = ctx
    .command('bsbot.rank <uid:text>')
    .alias('bbrank')
    .alias('bbrankss', {options: {p: "ss"}})
    .alias('bbrankbl', {options: {p: "bl"}})
    .alias('ssrank', {options: {p: "ss"}})
    .alias('blrank', {options: {p: "bl"}})
    .alias('!rankss', {options: {p: "ss"}})
    .alias('!rankbl', {options: {p: "bl"}})
    .alias('irankss', {options: {p: "ss"}})
    .alias('irankbl', {options: {p: "bl"}})
    .option('p', '[platform:string]')
    .action(async ({session, options}, input) => {
      let rankOps = {
        puppeteer:ctx.puppeteer,
        renderBaseURL: cfg.remoteRenderURL,
        onStartRender() {session.send("开始渲染啦，请耐心等待5s")},
        platform:  options.p=='ss'? 'score-saber' : 'beat-leader',
        background: 'default'
      } satisfies RenderOpts
      const img = await renderRank(input, rankOps)
      session.sendQueued(img)
    })

}
