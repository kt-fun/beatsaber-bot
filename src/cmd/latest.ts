import {BSMapItemV2 as Item} from "../msg-render";
import {Context, h} from "koishi";
import {Config} from "../config";
import {bsRequest} from "../utils/bsRequest";
import {render} from "../img-render";
import {screenShot} from "../utils/renderImg";

export function LatestCmd(ctx:Context,cfg:Config) {
  const bsClient = bsRequest(ctx,cfg)
  const newsubcmd = ctx
    .command('bsbot.new')
    .alias('bbnew')
    .action(async ({ session, options }, input) => {
      console.log("action new")
      const res = await bsClient.getLatestMaps(3)

      const text = session.text('commands.bsbot.latest.info')
      session.send(h('message', h('quote', {id: session.messageId}), text))
      for (let i=0;i<res.length;i++) {
        const item =res[i]

        // const url = `${cfg.rankRenderURL}/render/map/${item.id}`
        // console.log("wait",url)
        // const buffer = await screenShot(ctx,url,'#render-result',()=>{},1000)
        // const image = h.image(buffer,'image/png')
        let image = await render(item,ctx)
        await session.send(image)
        await session.send(h.audio(item.versions[0].previewURL))
        cfg.imgRenderMode
      }

    })

}
