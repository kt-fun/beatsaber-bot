import {Context} from "koishi";
import {KoishiDB} from "./db";
import { Config, Logger, RenderService } from "beatsaber-bot-core";
import {createCommonService} from "beatsaber-bot-core";

export const createServices = (ctx: Context, cfg: Config, logger: Logger) => {
  let browserGetter
  // @ts-ignore
  if(ctx?.puppeteer?.browser) {
    // @ts-ignore
    browserGetter = () => ctx?.puppeteer?.browser
  }
  const commonService = createCommonService(cfg, logger)
  const render = RenderService.create({...cfg.render, browserGetter, logger, api: commonService.api})
  const db = new KoishiDB(ctx)
  return {
    render,
    db,
    ...commonService
  }
}
