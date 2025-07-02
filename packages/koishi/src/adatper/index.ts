import {Config, getBot} from "beatsaber-bot-core";
import {Context} from "koishi";
import {InitDBModel} from "@/service";
import {loadCmd} from "@/adatper/cmd";
import {loadWS} from "@/adatper/ws";
import {loadSchedule} from "@/adatper/schedule";


export const koishiAdapter = (ctx: Context, config: Config) => {
  InitDBModel(ctx)
  loadCmd(ctx, config)
  loadWS(ctx, config)
  loadSchedule(ctx, config)
}
