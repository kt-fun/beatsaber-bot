import {Context, h} from "koishi";
import {Config} from "../config";
import {bsRequest} from "../utils/bsRequest";
import { renderMap} from "../img-render";

export function LatestCmd(ctx:Context,cfg:Config) {
  const bsClient = bsRequest(ctx,cfg)
  const latestCmd = ctx
    .command('bsbot.new')
    .alias('bbnew')
    .action(async ({ session, options }, input) => {
      console.log("action new")
      const res = await bsClient.getLatestMaps(3)

      const text = session.text('commands.bsbot.latest.info')
      session.send(h('message', h('quote', {id: session.messageId}), text))
      for (let i=0;i<res.length;i++) {
        const item =res[i]
        let image = await renderMap(item,ctx)
        await session.send(image)
        await session.send(h.audio(item.versions[0].previewURL))
        cfg.imgRenderMode
      }

    })

}
