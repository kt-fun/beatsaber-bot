import Puppeteer from 'koishi-plugin-puppeteer'
import { RenderService } from 'beatsaber-bot-core/img-render'
import { APIService, Config } from 'beatsaber-bot-core'
import { Context } from 'koishi'

export const sleep = async (millsec: number = 5000) => {
  await new Promise<void>((resolve, reject) => {
    setTimeout(resolve, millsec)
  })
}

export const screenshot = async (
  puppeteer: Puppeteer,
  url: string,
  selector: string,
  onLoad?: () => any,
  onError?: (e) => any,
  waitTime: number = 5000
) => {
  try {
    const page = await puppeteer.page()
    await page.setViewport({
      width: 1400,
      height: 4096,
      deviceScaleFactor: 2,
    })
    await page.goto(url, { timeout: 0, waitUntil: 'domcontentloaded' })
    onLoad?.()
    await sleep(waitTime)
    const elm = await page.waitForSelector(selector, { timeout: waitTime })
    const buffer = await elm.screenshot({})
    await page.close()
    return buffer
  } catch (err) {
    onError?.(err)
  }
}

export class ImgRender extends RenderService {
  ctx: Context
  constructor(config: Config, api: APIService, ctx: Context) {
    super()
    this.config = config as any
    this.api = api
    this.ctx = ctx
    this.baseConfig = {
      renderBaseURL: this.config.remoteRenderURL,
      waitTimeout: this.config.rankWaitTimeout,
    }
    this.htmlToImgBufferConverter = async (html) => {
      const buf = await this.ctx.puppeteer.render(html, async (page, next) => {
        // onStart?.()
        await new Promise<void>((resolve, reject) => {
          setTimeout(resolve, 5000)
        })
        return (
          page
            .$('body')
            // @ts-ignore
            .then(next)
            .catch((e) => {
              // onError?.()
              return ''
            })
        )
      })
      return buf as any as Promise<string>
    }

    this.urlToImgBufferConverter = async (
      url,
      onRenderStart,
      onRenderError
    ) => {
      return screenshot(
        this.ctx.puppeteer,
        url,
        '#render-result',
        onRenderStart,
        onRenderError,
        8000
      )
    }
  }
}
//
// export const screenshotTmp = async (
//   puppeteer: Puppeteer,
//   url: string,
//   selector: string,
//   onLoad?: () => any,
//   waitTime: number = 5000
// ) => {
//   const page = await puppeteer.page()
//   await page.setViewport({
//     width: 1400,
//     height: 4096,
//     deviceScaleFactor: 2,
//   })
//   await page.goto(url, { timeout: 0, waitUntil: 'domcontentloaded' })
//   onLoad?.()
//   await new Promise<void>((resolve, reject) => {
//     setTimeout(() => {
//       resolve()
//     }, waitTime)
//   })
//   const elm = await page.waitForSelector(selector, { timeout: waitTime })
//   const buffer = await elm.screenshot({})
//   // = await page.screenshot({})
//   await page.close()
//   return buffer
// }
