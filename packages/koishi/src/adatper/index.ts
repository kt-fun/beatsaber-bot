import { Config } from "beatsaber-bot-core";
import {Context} from "koishi";
import {InitDBModel} from "./db";
import {loadCmd} from "./cmd";
import {loadWS} from "./ws";
import {loadSchedule} from "./schedule";


export const koishiAdapter = async (ctx: Context, config: Config) => {
  InitDBModel(ctx)
  loadCmd(ctx, config)
  loadWS(ctx, config)
  loadSchedule(ctx, config)
}
