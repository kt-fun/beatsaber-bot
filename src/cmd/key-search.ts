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
  const serachCmd = ctx
    .command('bsbot.search <key:text>')
    .alias('bbsou')
    .alias('bbsearch')
    .alias('bbmap')
    // .option('-n','<data:string>')
    .action(async ({ session, options }, input) => {
      let key = input
      if(input.length > 15) {
        key = input.slice(0,15)
        session.sendQuote(session.text('commands.bsbot.search.too-long-key',{key}))
      }
      const res = await api.BeatSaver.searchMapByKeyword(key)
      if(!res.isSuccess()) {
        session.sendQuote(session.text('commands.bsbot.search.not-found',{key}))
        return
      }
      const toBeSend = res.data.slice(0,3).map(it=> ({
        img: renderMap(it,ctx,cfg),
        bsmap:it
      }))
      const text = session.text('commands.bsbot.search.success', {key: key, length: toBeSend.length})
      session.sendQuote(text)

      for (const item of toBeSend) {
        session.sendQueued(await item.img)
        session.sendQueued(h.audio(item.bsmap.versions[0].previewURL))
      }
    })

  return {
    key: 'search',
    cmd: serachCmd
  }
}
