import {html2imgBuffer, type RenderOptions, url2imgBuffer} from "./puppeteer";
import {Browser, Puppeteer} from "puppeteer-core";
import {Fetch, createFetch} from "../fetch";
import { Logger } from "@/core";
import {z} from "zod/v4";
export type { RenderOptions as PuppeteerOptions }

export interface ImageRender {
  html2img: (html: string, opt: RenderOptions) => Promise<Buffer>
  url2img:  (url: string, opt: RenderOptions) => Promise<Buffer>
}

const common = z.object({
  defaultWaitTimeout: z.number().optional(),
  waitTimeout: z.number().optional(),
})

const cfConfig = z.object({
  cfAccountId: z.string().min(1, "Cloudflare account id is required"),
  cfAPIKey: z.string().min(1, "Cloudflare API key is required"),
})

const puppeteerConfig = z.object({
  puppeteerURL: z.string().describe("remote puppeteer url, eg: wss://browserless/xxx, https://browserless/xxx").optional(),
})

const strictRenderConfig = z.discriminatedUnion('mode', [
  z.object({ mode: z.literal('cf'), ...cfConfig.shape, ...common.shape }),
  z.object({ mode: z.literal('puppeteer'), ...puppeteerConfig.shape, ...common.shape }),
  z.object({ mode: z.literal('custom'), ...common.shape }),
])

export const renderSchema = strictRenderConfig
  .and(z.object({
    ...cfConfig.shape,
    ...puppeteerConfig.shape,
    ...common.shape
  }).partial())

export type RenderConfig = z.infer<typeof renderSchema>

type StrictRenderConfig = z.infer<typeof strictRenderConfig>




export class CFBrowserRendering implements ImageRender {
  f: Fetch
  constructor(accountId: string, cfAPIKey: string, logger: Logger) {
    this.f = createFetch(logger)
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
        "screenshotOptions": {
          quality: 90,
          type: 'webp'
        },
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

type ImageRenderCreateOptions = StrictRenderConfig & {
  logger: Logger,
  render?: ImageRender,
  browserGetter?: () => Promise<Browser>
}


export const getImageRender = (config: ImageRenderCreateOptions) => {
  const { logger, render, browserGetter, ..._cfg} = config
  const cfg = strictRenderConfig.parse(_cfg)
  if(cfg.mode === 'cf') {
    return new CFBrowserRendering(cfg.cfAccountId, cfg.cfAPIKey, logger)
  }
  if(cfg.mode === 'custom') {
    if(!render) throw new Error("please provide custom img render")
    return render
  }
  if(cfg.puppeteerURL) {
    return new PuppeteerRendering(RemoteBrowserGetter(cfg.puppeteerURL))
  }
  if(browserGetter) {
    return new PuppeteerRendering(browserGetter)
  }
  return null
}

export type CreateImageRenderOption = Parameters<typeof getImageRender>[0]
