import { RenderService } from 'beatsaber-bot-core/img-render'
import { APIService, Config, PuppeteerRender } from 'beatsaber-bot-core'
import { Context } from 'koishi'
import { creatPuppeteerRender } from '@/service/render/puppeteer'

export class ImgRender extends RenderService {
  ctx: Context
  private puppeteerRender: PuppeteerRender
  constructor(config: Config, api: APIService, ctx: Context) {
    super()
    this.config = config as any
    this.api = api
    this.ctx = ctx
    this.baseConfig = {
      renderBaseURL: this.config.remoteRenderURL,
      waitTimeout: this.config.rankWaitTimeout,
    }
    this.puppeteerRender = creatPuppeteerRender(config, ctx)
  }

  urlToImgBufferConverter = async (url, onRenderStart, onRenderError) => {
    const buffer = await this.puppeteerRender.screenshotURL(
      url,
      '#render-result',
      onRenderStart
    )
    return Buffer.from(buffer)
  }
  htmlToImgBufferConverter = async (html: string) => {
    const buf = await this.puppeteerRender.renderHTML(html, '#render-result')
    return Buffer.from(buf)
  }
}
