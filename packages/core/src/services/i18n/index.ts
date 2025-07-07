import {createTranslator} from "@/common/i18n";

export class I18nService {
  translator: (path: string, params: any, lang: string) => string
  constructor(config?: any) {
    this.translator = createTranslator(config)
  }
  mergeConfig(lang: string, obj: any) {

  }

  loadLang(lang: string) {

  }

  tran(path: string, params = {}, lang = 'zh-CN'): string {
    return this.translator(path, params, lang)
  }
}
