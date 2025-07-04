import {Context} from "koishi";
import {KoishiDB} from "@/service";
import { Config, Logger } from "beatsaber-bot-core";
import { RenderService, APIService } from "beatsaber-bot-core";
import { I18nService, S3Service } from "beatsaber-bot-core/infra";

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
  const i18n = new I18nService()
  return {
    api,
    render,
    db,
    s3,
    i18n
  }
}
