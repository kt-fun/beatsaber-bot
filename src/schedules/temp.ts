import {Context, h, Logger} from "koishi";
import {Config} from "../config";
import {APIService} from "../service";
import {screenshotTmp} from "../img-render";
import dayjs from "dayjs";
import isBetween from 'dayjs/plugin/isBetween'
dayjs.extend(isBetween)

export const ScoreMonitor = (ctx:Context,config:Config,api:APIService,logger:Logger) => {

  ctx.cron(config.tempCron,async ()=> {
    logger.info('trigger lb score report, accept', dayjs().format('YYYY-MM-DD HH:mm:ss'))
    const res =await ctx.database.get('BSBotSubscribe', {
      type:"lb-rank"
    })
    if(res.length <= 0){
      return
    }
    const [hitbuf, scorebuf] = await Promise.all([
      screenshotTmp(ctx.puppeteer, 'https://aiobs.ktlab.io/tmp/lb/hitcnt', '#render-result',()=>{}, 8000),
      screenshotTmp(ctx.puppeteer, 'https://aiobs.ktlab.io/tmp/lb/score', '#render-result',()=>{}, 8000)
    ])
    const hitmsg = h.image(hitbuf, 'image/png')
    const scoremsg = h.image(scorebuf, 'image/png')
    for (const group of res) {
      const bot = ctx.bots[`${group.platform}:${group.selfId}`]
      if(!bot) {
        continue
      }
      await bot.sendMessage(group.channelId, hitmsg)
      await bot.sendMessage(group.channelId, scoremsg)
    }
  })
}
