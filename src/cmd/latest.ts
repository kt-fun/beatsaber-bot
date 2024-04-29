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
      const msgs = res.map(item=>  ({
        audio:h.audio(item.versions[0].previewURL),
        image: renderMap(item,ctx,cfg)
      }))
      for (let i=0;i<msgs.length;i++) {
        const item =msgs[i]
        const [msgId,] = await session.sendQueued(await item.image)
        await session.sendQueued(item.audio)
      }

    })

}
