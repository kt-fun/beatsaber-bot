import {Config} from "../config";
import {Context, h, Logger, Session} from "koishi";
import {renderMap} from "../img-render";
import {APIService} from "../service";

interface QueryOption {
  mapper?: string;
  q?: string;
  sortOrder: string;
  automapper?: boolean;
  chroma?: boolean;
  verified?: boolean;
  maxNps?: string;
  minNps?: string;
  from?: string;
  to?: string;
  tags?: string;
}

export function KeySearchCmd(ctx:Context,cfg:Config,api:APIService,logger:Logger) {
  const serachsubcmd = ctx
    .command('bsbot.search <key:text>')
    .alias('bbsou')
    .alias('bbsearch')
    .alias('bbmap')
    // .option('-n','<data:string>')
    .action(async ({ session, options }, input) => {
      let key = input
      if(input.length > 15) {
        key = input.slice(0,15)
        sendQuoteMsg(session,session.text('commands.bsbot.search.too-long-key',{key}))
      }
      const res = await api.BeatSaver.searchMapByKeyword(key)
      if(!res.isSuccess()) {
        sendQuoteMsg(session, session.text('commands.bsbot.search.not-found',{key:key}))
        return
      }
      const toBeSend = res.data.slice(0,3).map(it=> ({
        img: renderMap(it,ctx,cfg),
        bsmap:it
      }))
      const text = session.text('commands.bsbot.search.success', {key: key, length: toBeSend.length})
      session.sendQueued(h('message', h('quote', {id: session.messageId}), text))

      for (const item of toBeSend) {
        session.sendQueued(await item.img)
        session.sendQueued(h.audio(item.bsmap.versions[0].previewURL))
      }
    })
}

function sendQuoteMsg(session:Session, ...content:h.Fragment[]) {
  session.sendQueued(h('message',{}, h('quote', {id: session.messageId}), ...content))
}
