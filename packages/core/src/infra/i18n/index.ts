import { interpolate } from './parser'
import { interpolateString } from './util'

export class I18nService {
  obj: any = {}
  constructor(config?: any) {

  }
  mergeConfig(lang: string, obj: any) {

  }

  loadLang(lang: string) {

  }

  tran(path: string, params = {}, lang = 'zh-cn'): string {
    const keys = path.split('.')
    let result = this.obj[lang]
    if(!result) {
      return null
    }
    for (const key of keys) {
      if (result[key] !== undefined) {
        result = result[key]
      } else {
        return null
      }
    }
    try {
      if (typeof result === 'string') {
        return interpolate(result, params)
      }
    } catch (e) {
      return interpolateString(result, params)
    }

    return null
  }
}
