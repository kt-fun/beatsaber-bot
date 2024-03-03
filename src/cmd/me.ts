import {Context, h} from "koishi";
import {Config} from "../config";
import {bsRequest} from "../utils/bsRequest";
import {scRequest} from "../utils/scRequest";
import {renderRank} from "./rank";

export function MeCmd(ctx:Context,cfg:Config) {

  const bsClient = bsRequest(ctx,cfg)
  const scClient = scRequest(ctx,cfg)
  const rankSubCmd = ctx
    .command('bsbot.me')
    .userFields(['bindId'])
    .alias('bbme')
    .action(async ({ session, options }, input) => {
      const bindId = session.user.bindId
      if (!bindId) {
        session.send(session.text('commands.bsbot.me.not-found'))
        return
      }
      await renderRank(session,bindId,ctx,cfg)
    })
}
