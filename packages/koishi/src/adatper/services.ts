import {Context} from "koishi";
import {KoishiDB} from "./db";
import { Config, Logger, I18nService, S3Service, RenderService, APIService } from "beatsaber-bot-core";

import zhCN from 'beatsaber-bot-core/services/i18n/zh-cn.json'

export const createServices = (ctx: Context, cfg: Config, logger: Logger) => {
  const api = new APIService(cfg, logger)
  let browserGetter
  // @ts-ignore
  if(ctx?.puppeteer?.browser) {
    // @ts-ignore
    browserGetter = () => ctx?.puppeteer?.browser
  }
  const render = RenderService.create({...cfg.render, browserGetter, logger, api})
  const db = new KoishiDB(ctx)
  let s3
  if (cfg.s3.enabled) {
    s3 = new S3Service(cfg.s3)
  }
  const i18n = new I18nService({
    'zh-CN': zhCN,
  })
  return {
    api,
    render,
    db,
    s3,
    i18n
  }
}
