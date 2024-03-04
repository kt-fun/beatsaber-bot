import {Context, h, Session} from "koishi";
import {Config} from "../config";
import {screenShot} from "../utils/renderImg";

export function RankCmd(ctx:Context,cfg:Config) {
  // const bsClient = bsRequest(ctx,cfg)
  const newsubcmd = ctx
    .command('bsbot.rank <uid:text>')
    .alias('bbrank')
    .option('p', '<platform:string>')
    .action(async ({ session, options }, input) => {
      let rankOps = {
        platform: 'beat-leader',
        background: 'default'
      }
      if(options.p=='ss') {
        rankOps.platform = 'score-saber'
      }
      // todo need to ensure user exist
        await renderRank(session,input,ctx,cfg,rankOps as any)
    })

}

interface rankOps {
  platform: 'score-saber' | 'beat-leader',
  background: string
}

export const renderRank = async (session:Session, uid:string,ctx:Context,cfg:Config,renderOps:rankOps = {
  platform: 'beat-leader',
  background: 'default'
}) => {
  const url = `${cfg.rankRenderURL}/render/${renderOps.platform}/${uid}`
  const buffer = await screenShot(ctx,url,'#render-result',()=>{session.send("开始渲染啦，请耐心等待5s")})
  const image= h.image(buffer, 'image/png')
  session.send(image)
}
