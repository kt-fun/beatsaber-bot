import {Context, h, Logger} from "koishi";
import {Config} from "../config";
import {APIService} from "../service";
import {screenshotTmp} from "../img-render/rendertmp";
import dayjs from "dayjs";
import isBetween from 'dayjs/plugin/isBetween'
dayjs.extend(isBetween)

export const ScoreMonitor = (ctx:Context,config:Config,api:APIService,logger:Logger) => {
  ctx.setInterval(async ()=> {
    const today = dayjs().format('YYYY-MM-DD')
    const report = dayjs().isBetween(dayjs(today+' 15:40:00'), dayjs(today + ' 23:59:59'))
    if(!report) {
      return
    }
    logger.info('trigger lb score reporter')
    const res =await ctx.database.get('BSBotSubscribe', {
      type:"lb-rank"
    })
    if(res.length <= 0){
      return
    }
    const [hitbuf, scorebuf] = await Promise.all([
      screenshotTmp(ctx.puppeteer, 'https://aiobs.ktlab.io/tmp/lb/hitcnt', '#render-result'),
      screenshotTmp(ctx.puppeteer, 'https://aiobs.ktlab.io/tmp/lb/score', '#render-result')
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
  }, 60 * 60 * 1000)
}
