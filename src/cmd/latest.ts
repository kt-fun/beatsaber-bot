import {Context, h, Logger} from "koishi";
import {Config} from "../config";
import { renderMap} from "../img-render";
import {APIService} from "../service";

export function LatestCmd(ctx:Context,cfg:Config,api:APIService,logger:Logger) {
  const log = logger.extend('LatestCmd')
  const latestCmd = ctx
    .command('bsbot.latest')
    .alias('bbnew')
    .alias('bblatest')
    .action(async ({ session, options }, input) => {
      const res = await api.withRetry(()=> api.BeatSaver.getLatestMaps(3))

      if(!res.isSuccess()) {
        log.info(`fetch new failed, msg: ${res.msg}`)
        session.sendQueued( session.text('commands.bsbot.latest.unknown-error'))
        return
      }
      const text = session.text('commands.bsbot.latest.info')
      session.sendQueued(h('message', h('quote', {id: session.messageId}), text))
      const msgs = res.data.map(item=>  ({
        audio:h.audio(item.versions[0].previewURL),
        image: renderMap(item,ctx,cfg)
      }))
      for (const msg of msgs) {
        session.sendQueued(await msg.image)
        session.sendQueued(msg.audio)
      }

    })

}
