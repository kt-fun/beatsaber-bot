import { Config } from "beatsaber-bot-core";
import {Context} from "koishi";
import {InitDBModel} from "./db";
import {loadCmd} from "./cmd";
import {loadWS} from "./ws";
import {loadSchedule} from "./schedule";
import {AgentHolder} from "@/adatper/agent";


export const koishiAdapter = async (ctx: Context, config: Config) => {
  InitDBModel(ctx)
  const agentHolder = new AgentHolder(ctx)
  await agentHolder.init()
  loadCmd(ctx, agentHolder, config)
  loadWS(ctx, agentHolder, config)
  loadSchedule(ctx,agentHolder, config)
}
