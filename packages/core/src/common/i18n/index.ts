
import { translate } from './translate'
import { merge } from './util'
import common from '../../locales/zh-CN/common.json' with { type: 'json' }
import commands from '../../locales/zh-CN/commands.json' with { type: 'json' }
import events from '../../locales/zh-CN/events.json' with { type: 'json' }
import remote from '../../locales/zh-CN/remote.json' with { type: 'json' }
const defaultLang = 'zh-CN'

export class I18nService {
  private resources: Record<string, any> = {}

  constructor() {
    this.addResources(defaultLang, common)
    this.addResources(defaultLang, commands)
    this.addResources(defaultLang, events)
    this.addResources(defaultLang, remote)
  }

  public addResources(locale: string, data: object) {
    if (!this.resources[locale]) {
      this.resources[locale] = {}
    }
    merge(this.resources[locale], data)
  }

  public tran(path: string, params = {}, lang = defaultLang): string {
    return translate(this.resources, path, params, lang)
  }
}
