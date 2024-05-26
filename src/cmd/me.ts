import {Context, Logger} from "koishi";
import {Config} from "../config";
import {APIService, RenderService} from "../service";
import {convertDiff} from "../utils/converter";
import {getUserBSAccountInfo} from "../service/db/db";
import {Platform} from "../types";


export function MeCmd(ctx:Context,cfg:Config, render:RenderService, api:APIService,logger:Logger) {
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
      let rankPlatform = options.p == 'ss' ? Platform.SS : Platform.BL
      const {blAccount, ssAccount} = await getUserBSAccountInfo(ctx, session.user.id)
      let accountId
      if (rankPlatform == Platform.BL && blAccount) {
        accountId = blAccount.platformUid
      } else if (rankPlatform == Platform.SS && ssAccount) {
        accountId = ssAccount.platformUid
      } else {
        session.sendQuote(session.text('commands.bsbot.me.not-found'))
        return
      }

      let onStartRender = () => {
        session.send(session.text('common.render.wait', {sec: cfg.rankWaitTimeout / 1000}))
      }
      if(input && input !== "") {
        // todo improve diff opts
        let diffOption
        if(options.d || options.m) {
          diffOption = {
            difficulty: convertDiff(options.d),
            mode: options.m
          }
        }
        const scoreReq = await api.BeatLeader.wrapperResult().getScoreByPlayerIdAndMapId(accountId, input, diffOption)
        if(!scoreReq.isSuccess()) {
          return session.text('commands.bsbot.me.score-not-found',{user: accountId, id: input})
        }

        const img = await render.renderScore(scoreReq.data.id.toString(), rankPlatform,onStartRender)
        session.sendQueued(img)
      }else {
        const img = await render.renderRank(accountId, rankPlatform,onStartRender)
        session.sendQueued(img)
      }
    })
  return {
    key: 'me',
    cmd: meCmd
  }
}
