import {Context, Logger} from "koishi";
import {Config} from "../config";
import {APIService, RenderService} from "../service";
import {getUserBSAccountInfo} from "../service/db/db";
import '../utils/extendedMethod'
import {Platform} from "../types";

export function WhoisCmd(ctx:Context,cfg:Config,render:RenderService,api:APIService,logger:Logger) {
  const whois = ctx
    .command('bsbot.who')
    .alias('bbwho')
    .alias('bbwhoss', {options: {p: "ss"}})
    .alias('bbwhobl', {options: {p: "bl"}})
    .alias('sswho', {options: {p: "ss"}})
    .alias('blwho', {options: {p: "bl"}})
    .alias('!whos', {options: {p: "ss"}})
    .alias('!whob', {options: {p: "bl"}})
    .alias('iwhos', {options: {p: "ss"}})
    .alias('iwhob', {options: {p: "bl"}})
    .option('p', '<platform:string>')
    .action(async ({session, options}, input) => {
      let rankPlatform = options.p == 'ss' ? Platform.SS : Platform.BL
      let reg = /<at id="([0-9a-zA-z]+)"\/>/
      if (!reg.test(input)) {
        session.sendQuote(session.text('commands.bsbot.who.need-at'))
        return
      }
      const [full, platformId,] = reg.exec(input)
      const res = await ctx.database.get('binding', {platform: session.platform, pid: platformId})
      if (res.length == 0) {
        session.sendQuote(session.text('commands.bsbot.who.not-found'))
        return
      }
      const userId = res[0].aid
      const {blAccount, ssAccount} = await getUserBSAccountInfo(ctx, userId)
      let accountId
      if (rankPlatform == Platform.BL && blAccount) {
        accountId = blAccount.platformUid
      } else if (rankPlatform == Platform.SS && ssAccount) {
        accountId = ssAccount.platformUid
      } else {
        session.sendQuote(session.text('commands.bsbot.who.not-bind'))
        return
      }
      let onStartRender = () => {
        session.send(session.text('common.render.wait', {sec: cfg.rankWaitTimeout / 1000}))
      }
      const img = await render.renderRank(accountId, rankPlatform, onStartRender)
      session.sendQueued(img)
    })
  return {
    key: 'whois',
    cmd: whois
  }
}
