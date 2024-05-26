import {Config} from "../config";
import {Context, h, Logger} from "koishi";
import {APIService, RenderService} from "../service";

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

export function KeySearchCmd(ctx:Context, cfg:Config, render:RenderService, api:APIService, logger:Logger) {
  const serachCmd = ctx
    .command('bsbot.search <key:text>')
    .alias('bbsou')
    .alias('bbsearch')
    .alias('bbmap')
    .action(async ({ session, options }, input) => {
      let key = input
      if(input.length > 15) {
        key = input.slice(0,15)
        session.sendQuote(session.text('commands.bsbot.search.too-long-key',{key}))
      }
      const res = await api.BeatSaver.wrapperResult().searchMapByKeyword(key)
      if(!res.isSuccess()) {
        session.sendQuote(session.text('commands.bsbot.search.not-found',{key}))
        return
      }
      let onStartRender = () => {
        session.send(session.text('common.render.wait', {sec: cfg.rankWaitTimeout / 1000}))
      }
      const toBeSend = res.data.slice(0,3).map(it=> ({
        img: render.renderMap(it, onStartRender),
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
