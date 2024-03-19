import {Context, h, Session} from "koishi";
import {Config} from "../config";
import {screenshot} from "../utils/renderImg";

export function ScoreCmd(ctx:Context,cfg:Config) {
  const scoreCmd = ctx
    .command('bsbot.score')
    .alias('bbscore')
    .option('p', '<platform:string>')
    .action(async ({ session, options }, input) => {
      let rankOps = {
        platform: 'beat-leader',
        background: 'default'
      }
      if(options.p=='ss') {
        rankOps.platform = 'score-saber'
      }
      // todo need to ensure score exist
      await renderScore(session,input,ctx,cfg,rankOps as any)
    })

}
interface renderOps {
  platform: 'score-saber' | 'beat-leader',
  background: string
}

export const renderScore = async (session:Session, scoreId:string,ctx:Context,cfg:Config,renderOps:renderOps = {
  platform: 'beat-leader',
  background: 'default'
}) => {
  const url = `${cfg.rankRenderURL}/render/${renderOps.platform}/score/${scoreId}`
  const buffer = await screenshot(ctx,url,'#render-result',()=>{session.send("开始渲染啦，请耐心等待5s")})
  const image= h.image(buffer, 'image/png')
  session.send(image)
}
