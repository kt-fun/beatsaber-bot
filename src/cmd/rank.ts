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
        onStartRender() {
          session.send(session.text('common.render.wait', {sec: cfg.rankWaitTimeout / 1000}))
        },
        platform:  options.p=='ss'? 'score-saber' : 'beat-leader',
        background: 'default',
        waitTimeout: cfg.rankWaitTimeout
      } satisfies RenderOpts
      const img = await renderRank(input, rankOps)
      session.sendQueued(img)
    })
    return {
      key: 'rank',
      cmd: rankCmd
    }
}
