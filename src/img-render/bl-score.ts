import {Context, h} from "koishi";
import {screenshot} from "./renderImg";
import {RenderOpts} from "./index";


export const renderScore = async (
  scoreId:string,
  renderOpts: RenderOpts
) => {
  const url = `${renderOpts.renderBaseURL}/render/${renderOpts.platform}/score/${scoreId}`
  const buffer = await screenshot(renderOpts.puppeteer,url,'#render-result',renderOpts.onStartRender)
  return h.image(buffer, 'image/png')
}
