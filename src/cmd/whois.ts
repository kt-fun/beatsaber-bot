import {Context, Logger} from "koishi";
import {Config} from "../config";
import {RenderOpts, renderRank} from "../img-render";
import {APIService} from "../service";
import {getUserBSAccountInfo} from "../utils/db";

export function WhoisCmd(ctx:Context,cfg:Config,api:APIService,logger:Logger) {
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
      let rankPlatform = options.p == 'ss' ? 'score-saber' as const : 'beat-leader' as const
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
      if (rankPlatform == 'beat-leader' && blAccount) {
        accountId = blAccount.platformUid
      } else if (rankPlatform == 'score-saber' && ssAccount) {
        accountId = ssAccount.platformUid
      } else {
        session.sendQuote(session.text('commands.bsbot.who.not-bind'))
        return
      }
      let rankOps = {
        puppeteer: ctx.puppeteer,
        renderBaseURL: cfg.remoteRenderURL,
        waitTimeout: cfg.rankWaitTimeout,
        onStartRender() {
          session.send(session.text('common.render.wait', {sec: cfg.rankWaitTimeout / 1000}))
        },
        platform: rankPlatform,
        background: 'default',
      } satisfies RenderOpts
      const img = await renderRank(accountId, rankOps)
      session.sendQueued(img)
    })
  return {
    key: 'whois',
    cmd: whois
  }
}
