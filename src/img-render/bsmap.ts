import {BSMap} from "../types";
import {Context, h} from "koishi";
import beatmap from "./components/beatmap/map";
import {renderHTML} from "./html";
import {screenshotRemoteMap} from "./renderImg";
import {RenderOpts} from "./index";


export const renderMap = async (bsmap: BSMap, ctx, cfg) => {
  if(cfg.renderMode === 'screenshot') {
    const image = await renderRemoteMap(bsmap.id, {
      puppeteer: ctx.puppeteer,
      renderBaseURL: cfg.rankRenderURL,
      platform:'score-saber',
      onStartRender:() => {
        console.log("start render id",bsmap.id)
      },
      background:'default',
      waitTimeout: cfg.waitTimeout,
    })
    return image
  }
  return await renderLocalMap(bsmap, ctx)
}

export const renderLocalMap = async (bsmap:BSMap,ctx:Context) => {
  const rootCmp = {
    components: {
      beatmap
    },
    data: () => ({
      bsMap: bsmap
    }),
    template:`<beatmap :bsmap="bsMap"/>`
  }
  const html = await renderHTML(rootCmp)
  return ctx.puppeteer.render(html)
}


export const renderRemoteMap = async (mapId:string,opts:RenderOpts) => {
  const buffer = await screenshotRemoteMap(opts.puppeteer,`${opts.renderBaseURL}/render/map/${mapId}`, '#render-result', opts.onStartRender,opts.waitTimeout)
  const image = h.image(buffer, 'image/png')
  return image
}
