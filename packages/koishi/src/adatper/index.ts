import { Config } from "beatsaber-bot-core";
import {Context} from "koishi";
import {InitDBModel} from "./support/db";
import {loadCmd} from "./trigger/cmd";
import {loadWS} from "./trigger/ws";
import {loadSchedule} from "./trigger/schedule";


export const koishiAdapter = async (ctx: Context, config: Config) => {
  InitDBModel(ctx)
  loadCmd(ctx, config)
  loadWS(ctx, config)
  loadSchedule(ctx, config)
}
