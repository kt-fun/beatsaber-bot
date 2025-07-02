import {html2imgBuffer, RenderOptions, url2imgBuffer} from "./puppeteer";
import {Browser, Puppeteer} from "puppeteer-core";
import {Fetch} from "@/infra/support/fetch";
export {RenderOptions as PuppeteerOptions}
export interface ImageRender {
  html2img: (html: string, opt: RenderOptions) => Promise<Buffer>
  url2img:  (url: string, opt: RenderOptions) => Promise<Buffer>
}

export type RenderConfig = {
  mode: 'cf' | 'puppeteer'
  puppeteerURL?: string
  defaultWaitTimeout?: number
  waitTimeout?: number
  cfAccountId?: string,
  cfAPIKey?: string,
}

export class CFBrowserRendering implements ImageRender {
  f: Fetch
  constructor(private accountId: string, private cfAPIKey: string) {
    this.f = new Fetch()
      .baseUrl(`https://api.cloudflare.com/client/v4/accounts/${accountId}`)
      .extend({
        headers: {
          Authorization: `Bearer ${cfAPIKey}`
        },
      })
  }
  private post(body) {
    return this.f.post('/browser-rendering/screenshot', {
      responseType: 'arrayBuffer',
      body: {
        ...body,
        "viewport": {
          "width": 3840,
          "height": 2160,
          "deviceScaleFactor": 2,
        },
        "gotoOptions": {
          "waitUntil": "networkidle0",
          "timeout": 30000
        },
      }
    })
  }



  async html2img (html: string, opt: RenderOptions) {
    const buf = await this.post({html: html, ...opt})
    return Buffer.from(buf)
  }
  async url2img (url: string, opt: RenderOptions) {
    const buf = await this.post({url: url, ...opt})
    return Buffer.from(buf)
  }
}

export class PuppeteerRendering implements ImageRender {
  constructor(private browserGetter: () => Promise<Browser>) {
  }
  async html2img (html: string, opt: RenderOptions) {
    return html2imgBuffer(this.browserGetter, html, opt)
  }
  async url2img (html: string, opt: RenderOptions) {
    return url2imgBuffer(this.browserGetter, html, opt)
  }
}


export const RemoteBrowserGetter = (addr: string) => {
  const p = new Puppeteer()
  let opt = {}
  if(addr.startsWith('ws')) {
    opt = { browserWSEndpoint: addr }
  }else if(addr.startsWith('http')) {
    opt = { browserURL: addr }
  }
  return () => p.connect(opt)
}


export const getImageRender = (cfg: RenderConfig & {browserGetter?: () => Promise<Browser>}) => {
  if(cfg.mode === 'cf') {
    return new CFBrowserRendering(cfg.cfAccountId, cfg.cfAPIKey)
  }
  if(cfg.puppeteerURL) {
    return new PuppeteerRendering(RemoteBrowserGetter(cfg.puppeteerURL))
  }
  if(cfg.browserGetter) {
    return new PuppeteerRendering(cfg.browserGetter)
  }
}
