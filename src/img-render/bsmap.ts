import {BSMap} from "../types";
import {Context} from "koishi";
import beatmap from "./components/map";
import {renderHTML} from "./index";

export const renderMap = async (bsmap:BSMap,ctx:Context) => {
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
