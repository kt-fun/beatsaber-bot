import {
  Config,
  PuppeteerProvider,
  PuppeteerRender,
  RemotePuppeteerProvider,
} from 'beatsaber-bot-core'
import { Context } from 'koishi'

export class PluginPuppeteerProvider implements PuppeteerProvider {
  ctx: Context
  _browser: any
  _ok: boolean = true
  async browser(): Promise<any> {
    if (this._browser) {
      return this._browser
    }
    try {
      await import('koishi-plugin-puppeteer')
      const pup = this.ctx.puppeteer
      this._browser = pup.browser
      return this._browser
    } catch (e) {
      console.error('koishi-plugin-puppeteer not installed, render is disable')
      this._ok = false
    }
  }
  constructor(config: Config, ctx: Context) {
    this.ctx = ctx
  }

  get ok() {
    return this._ok != null
  }
}

export const creatPuppeteerRender = (config: Config, ctx: Context) => {
  const pluginProvider = new PluginPuppeteerProvider(config, ctx)
  const remoteProvider = new RemotePuppeteerProvider(config)
  if (config.preferPuppeteerMode === 'local-plugin') {
    return new PuppeteerRender([pluginProvider, remoteProvider])
  }
  return new PuppeteerRender([remoteProvider, pluginProvider])
}
