import {Context, h, Session} from "koishi";
import {Config} from "../config";
import {platform} from "node:os";

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
  const url = `${cfg.rankRenderURL}/render/${platform}/${uid}`
  console.log("rank",url)
  const page = await ctx.puppeteer.page()
  await page.setViewport({
    width: 960,
    height: 680 ,
    deviceScaleFactor: 2,
  })
  await page.goto(url);
  session.send("开始渲染啦，请耐心等待5s")
  console.log("start render")
  await new Promise<void>((resolve, reject)=> {
    setTimeout(()=> {resolve()},5000)
  })
  console.log("start screenshot")
  const buffer = await page.screenshot({})
  const image= h.image(buffer, 'image/png')
  session.send(image)
  page.close()
}
