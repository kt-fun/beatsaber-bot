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
      session.send(h('message', h('quote', {id: session.messageId}), text))
      // todo
      for (let i=0;i<res.length;i++) {
        const item =res[i]
        let image = await renderMap(item,ctx)
        await session.send(image)
        await session.send(h.audio(item.versions[0].previewURL))
      }

    })

}
