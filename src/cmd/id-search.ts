import {Context, h} from "koishi";
import {Config} from "../config";
import {render} from "../img-render";
import {bsRequest} from "../utils/bsRequest";
import {screenShot} from "../utils/renderImg";

export function IdSearchCmd(ctx:Context,cfg:Config) {
  const bsClient = bsRequest(ctx,cfg)
  const serachIdsubcmd = ctx
    .command('bsbot.id [mapId:text]')
    .alias('bbid')
    .alias('!bsr')
    .shortcut(/(^[0-9a-eA-E]{3,5}$)/, { args: ['$1'] })
    .action(async ({ session, options }, input) => {
      console.log("render id",input)
      if (!input || input && input.length < 1) {
        return
      }
      const reg = /[a-f0-9]{1,6}/
      if(!reg.test(input)) {
        session.send(h('message',
          h('quote', {id: session.messageId}),
          session.text('commands.bsbot.id-search.error-map-id',{input})
        ))
        return
      }
      console.log("render")
      const res = await bsClient.searchMapById(input)
      if(res == null) {
        session.send(
          h('message',
            h('quote', {id: session.messageId}),
            session.text('commands.bsbot.id-search.not-found',{input})
          )
        )
      }else {
        const image = await render(res,ctx)
        session.send(image)
        session.send(h.audio(res.versions[0].previewURL))
      }
    })

}
