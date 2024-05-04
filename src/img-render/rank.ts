import {h} from "koishi";
import {screenshot} from "./renderImg";
import {RenderOpts} from "./index";


export const renderRank = async (
  uid: string,
  renderOpts: RenderOpts
) => {
  const url = `${renderOpts.renderBaseURL}/render/${renderOpts.platform}/${uid}`
  const buffer = await screenshot(renderOpts.puppeteer, url, '#render-result', renderOpts.onStartRender)
  const image = h.image(buffer, 'image/png')
  return image
}
