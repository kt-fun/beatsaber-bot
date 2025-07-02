import {Context} from "koishi";
import {KoishiDB} from "@/service";
import { APIService } from "beatsaber-bot-core/service/api";
import { Config, Logger } from "beatsaber-bot-core";
import { RenderService } from "beatsaber-bot-core/service/render";
import { getImageRender } from 'beatsaber-bot-core/infra'
import { S3Service } from "beatsaber-bot-core/infra/s3";

export const createServices = (ctx: Context, cfg: Config, logger: Logger) => {

  // new CFBrowserRendering(cfg.renderMode)
  const api = new APIService(cfg, logger)
  let browserGetter
  // @ts-ignore
  if(ctx?.puppeteer?.browser) {
    // @ts-ignore
    browserGetter = () => ctx?.puppeteer?.browser
  }
  const imgRender = getImageRender({...cfg.render, browserGetter})
  const render = new RenderService(api,imgRender)
  const db = new KoishiDB(ctx)
  let s3
  if (cfg.s3.enabled) {
    s3 = new S3Service(cfg.s3)
  }
  return {
    api,
    render,
    db,
    s3
  }
}
