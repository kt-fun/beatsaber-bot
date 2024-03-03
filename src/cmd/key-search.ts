import {Config} from "../config";
import {Context, h, Session} from "koishi";
import {bsRequest} from "../utils/bsRequest";
import {render} from "../img-render";

export function KeySearchCmd(ctx:Context,cfg:Config) {

  const bsClient = bsRequest(ctx,cfg)
  const serachsubcmd = ctx
    .command('bsbot.search <key:text>')
    .alias('bbsearch')
    .action(async ({ session, options }, input) => {

      let key = input
      if(input.length > 15) {
        key = input.slice(0,15)
        session.send(
          h('message',{},
            h('quote', {
              id: session.messageId
            }),
            session.text('commands.bsbot.key-search.too-long-key',{key})
          )
        )
      }
      const res = await bsClient.searchMapByKeyword(key)
      if(res.length == 0) {
        session.send(
          h('message',{},
            h('quote', {
              id: session.messageId
            }),
            session.text('commands.bsbot.key-search.not-found',{key:key})
          )
        )
      }
      let toBeSend = res
      if(res.length > 3) {
        toBeSend = res.slice(0,3)
      }
      const text = session.text('commands.bsbot.key-search.success', {key: key, length: toBeSend.length})
        session.send(h('message', h('quote', {id: session.messageId}), text))
        for (let i=0;i<toBeSend.length;i++) {
          const item =toBeSend[i]
          let html = await render(item)
          const image= await ctx.puppeteer.render(html)
          await session.send(image)
          await session.send(h.audio(item.versions[0].previewURL))
        }

    })
}
