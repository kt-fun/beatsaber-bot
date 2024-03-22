import {Context} from "koishi";
import {Config} from "../config";
import {APIService} from "../service";

export function UnSubscribeCmd(ctx:Context,cfg:Config,api:APIService) {
  ctx
    .command('bsbot.unsubscribe <userIds:text>')
    .alias('bbunsub')
    .action(async ({ session, options }, input) => {
      if(input == "all") {
        await ctx.database.remove("BSaverSubScribe",{
          uid: session.userId,
          username: session.username,
          channelId: session.event.channel.id,
          platform: session.platform
        })
        session.send(session.text("commands.bsbot.unsubscribe.cancel-all"))
      }else {
        await ctx.database.remove("BSaverSubScribe",{
          uid: session.userId,
          username: session.username,
          channelId: session.event.channel.id,
          platform: session.platform,
          bsUserId: input,
        })
        session.send(session.text("commands.bsbot.unsubscribe.cancel",{id:input}))
      }
    })

}
