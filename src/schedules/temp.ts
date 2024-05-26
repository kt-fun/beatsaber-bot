import {Context, h, Logger} from "koishi";
import {Config} from "../config";
import {APIService, RenderService} from "../service";
import dayjs from "dayjs";
import isBetween from 'dayjs/plugin/isBetween'
dayjs.extend(isBetween)

export const ScoreMonitor = (ctx:Context,config:Config,render:RenderService,api:APIService,logger:Logger) => {

  ctx.cron(config.tempCron,async ()=> {
    logger.info('trigger lb score report, accept', dayjs().format('YYYY-MM-DD HH:mm:ss'))
    const res =await ctx.database.get('BSBotSubscribe', {
      type:"lb-rank"
    })
    if(res.length <= 0){
      return
    }
    const [hitbuf, scorebuf] = await Promise.all([render.renderLBHitCount(), render.renderLBScore()])
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
