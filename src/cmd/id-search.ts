import {Context, h, Logger} from "koishi";
import {Config} from "../config";
import {renderMap} from "../img-render";
import {APIService} from "../service";

export function IdSearchCmd(ctx:Context,cfg:Config,api:APIService, logger:Logger) {
  const searchIdCmd = ctx
    .command('bsbot.id [mapId:string]')
    .alias('bbid')
    .alias('!bsr')
    .shortcut(/(^[0-9a-fA-F]{3,5}$)/, { args: ['$1'] })
    .action(async ({ session, options }, input) => {
      if (!input || input && input.length < 1) {
        return
      }
      const reg = /^\s+[a-fA-F0-9]{1,6}\s+$/
      if(!reg.test(input)) {
        session.sendQueued(h('message',
          h('quote', {id: session.messageId}),
          session.text('commands.bsbot.id.error-map-id',{input})
        ))
        return
      }
      const res = await api.BeatSaver.searchMapById(input)
      if(!res.isSuccess()) {
        session.sendQueued(
          h('message',
            h('quote', {id: session.messageId}),
            session.text('commands.bsbot.id.not-found',{input})
          )
        )
      }else {
        const image = await renderMap(res.data,ctx,cfg)
        await session.sendQueued(image)
        session.sendQueued(h.audio(res.data.versions[0].previewURL))
      }
    })
}
