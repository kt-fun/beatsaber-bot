import {Context} from "koishi";
import {Config} from "../config";
import {bsRequest} from "../utils/bsRequest";

export function SubscribeCmd(ctx:Context,cfg:Config) {
  const bsClient = bsRequest(ctx,cfg)
  const subcmd = ctx
    .command('bsbot.unsubscribe <userIds:text>')
    .alias('bbtsub')

}
