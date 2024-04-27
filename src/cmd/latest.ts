import {Context, h} from "koishi";
import {Config} from "../config";
import { renderMap} from "../img-render";
import {APIService} from "../service";

export function LatestCmd(ctx:Context,cfg:Config,api:APIService) {
  const latestCmd = ctx
    .command('bsbot.new')
    .alias('bbnew')
    .action(async ({ session, options }, input) => {
      console.log("action new")
      const res = await api.BeatSaver.getLatestMaps(3)

      const text = session.text('commands.bsbot.latest.info')
      session.sendQueued(h('message', h('quote', {id: session.messageId}), text))
      for (let i=0;i<res.length;i++) {
        const item =res[i]
        let image = await renderMap(item,ctx,cfg)
        await session.sendQueued(image)
        await session.sendQueued(h.audio(item.versions[0].previewURL))
      }

    })

}
