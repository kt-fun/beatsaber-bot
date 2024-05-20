import {Context, Logger} from "koishi";
import {Config} from "../config";
import {RenderOpts, renderRank, renderScore} from "../img-render";
import {APIService} from "../service";
import {convertDiff} from "../utils/converter";
import {getUserBSAccountInfo} from "../utils/db";


export function MeCmd(ctx:Context,cfg:Config,api:APIService,logger:Logger) {
  const meCmd = ctx
    .command('bsbot.me [mapId:string]')
    .userFields(['id'])
    .alias('bbme')
    .alias('bbmess', {options: {p: "ss"}})
    .alias('bbmebl', {options: {p: "bl"}})
    .alias('ssme', {options: {p: "ss"}})
    .alias('blme', {options: {p: "bl"}})
    .alias('!ws', {options: {p: "ss"}})
    .alias('!wb', {options: {p: "bl"}})
    .alias('iws', {options: {p: "ss"}})
    .alias('iwb', {options: {p: "bl"}})
    .alias('!wss', {options: {p: "ss"}})
    .alias('!wbl', {options: {p: "bl"}})
    .alias('iwss', {options: {p: "ss"}})
    .alias('iwbl', {options: {p: "bl"}})
    .option('p', '[platform:string]')
    .option('d', '[diffculty:string]')
    .option('m', '[mode:string]')
    .action(async ({ session, options }, input) => {
      let rankPlatform = options.p == 'ss' ? 'score-saber' as const : 'beat-leader' as const
      const {blAccount, ssAccount} = await getUserBSAccountInfo(ctx, session.user.id)
      let accountId
      if (rankPlatform == 'beat-leader' && blAccount) {
        accountId = blAccount.platformUid
      } else if (rankPlatform == 'score-saber' && ssAccount) {
        accountId = ssAccount.platformUid
      } else {
        session.sendQuote(session.text('commands.bsbot.me.not-found'))
        return
      }

      let renderOpts = {
        puppeteer: ctx.puppeteer,
        renderBaseURL: cfg.remoteRenderURL,
        waitTimeout: cfg.rankWaitTimeout,
        onStartRender() {
          session.sendQueued(session.text('common.render.wait', {sec: cfg.rankWaitTimeout / 1000}))
        },
        platform: rankPlatform,
        background: 'default',
      } satisfies RenderOpts
      if(input && input !== "") {
        // todo improve diff opts
        let diffOption
        if(options.d || options.m) {
          diffOption = {
            difficulty: convertDiff(options.d),
            mode: options.m
          }
        }
        const scoreReq = await api.BeatLeader.getScoreByPlayerIdAndMapId(accountId, input, diffOption)
        if(!scoreReq.isSuccess()) {
          return session.text('commands.bsbot.me.score-not-found',{user: accountId, id: input})
        }
        const img = await renderScore(scoreReq.data.id.toString(), renderOpts)
        session.sendQueued(img)
      }else {
        const img = await renderRank(accountId,renderOpts)
        session.sendQueued(img)
      }
    })
  return {
    key: 'me',
    cmd: meCmd
  }
}
