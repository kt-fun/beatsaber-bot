import {Context, h, Session} from "koishi";
import {Config} from "../config";

export function RankCmd(ctx:Context,cfg:Config) {
  // const bsClient = bsRequest(ctx,cfg)
  const newsubcmd = ctx
    .command('bsbot.rank <uid:text>')
    .alias('bbrank')
    .action(async ({ session, options }, input) => {
      // todo need to ensure user exist
        await renderRank(session,input,ctx,cfg)
    })

}



export const renderRank = async (session:Session, uid:string,ctx:Context,cfg:Config) => {
  const url = `${cfg.rankRenderURL}/render/beat-leader/${uid}`
  console.log("rank",url)
  const page = await ctx.puppeteer.page()
  await page.setViewport({
    width: 960,
    height: 680 ,
    deviceScaleFactor: 2,
  })
  await page.goto(url);
  // wait for 4s
  session.send("开始渲染啦，请耐心等待5s")
  console.log("start render")
  await new Promise<void>((resolve, reject)=> {
    setTimeout(()=> {resolve()},6000)
  })
  console.log("start screenshot")
  const buffer = await page.screenshot({})
  const image= h.image(buffer, 'image/png')
  session.send(image)
  page.close()
}
