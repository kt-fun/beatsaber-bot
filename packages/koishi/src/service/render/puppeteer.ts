import {
  Config,
  PuppeteerProvider,
  PuppeteerRender,
  RemotePuppeteerProvider,
} from 'beatsaber-bot-core'
import { Context } from 'koishi'

let enable = false

async function init() {
  try {
    await import('koishi-plugin-puppeteer')
    enable = true
    console.log('enable koishi puppeteer')
  } catch (e) {
    console.error('koishi-plugin-puppeteer not installed, render is disable')
  }
}

init()

export class PluginPuppeteerProvider implements PuppeteerProvider {
  ctx: Context
  browser: any
  constructor(config: Config, ctx: Context) {
    this.ctx = ctx
    init().then(() => {
      setTimeout(() => {
        const pup = this.ctx.puppeteer
        if (pup) {
          // @ts-ignore
          this.browser = pup.browser
          console.log('puppeteer initialized')
        }
      }, 5000)
    })
  }

  get ok() {
    return this.browser != null && this.browser != undefined
  }
}

export const creatPuppeteerRender = (config: Config, ctx: Context) => {
  const pluginProvider = new PluginPuppeteerProvider(config, ctx)
  const remoteProvider = new RemotePuppeteerProvider(config)
  return new PuppeteerRender([pluginProvider, remoteProvider])
}
