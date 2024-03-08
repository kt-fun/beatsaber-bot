import {Context, h} from "koishi";
import {Config} from "./config";
import {WSEvent} from "./types";
import { renderMap} from "./img-render";
import {screenShot} from "./utils/renderImg";

export function pluginWebSocket(ctx: Context, config:Config) {
  const ws = ctx.http.ws(config.beatSaverWSURL ?? "wss://ws.beatsaver.com/maps")
  ws.on("message", async (event)=>{
    const data = JSON.parse(event.toString()) as WSEvent
    console.log("received", data.type)
    if(
      data.type == "MAP_UPDATE"
    ) {
      const bsmap = data.msg
      if(!bsmap.versions.some(it=>it.state == "Published")) {
        return
      }
      if(bsmap.declaredAi != "None") {
        console.log(bsmap.declaredAi)
        return
      }
      const userId = bsmap.uploader.id
      const allUser = await ctx.database.get('BSaverSubScribe', {
        bsUserId: "all",
      })
      const allUsersIdAndChannelId = allUser.map(item=>({
        cid:item.channelId,
        uid:item.uid
      }))

      const users = await ctx.database.get('BSaverSubScribe', {
        bsUserId: userId.toString(),
      })
      const filteredUsers= users.filter(it=>
        allUser.some(item=>
          it.channelId == item.channelId
          && it.uid == item.uid
          && it.platform == item.platform
        )
      )
      let needSend = allUser.concat(filteredUsers)

      // allUser.filter()

      for (let idx = 0; idx < needSend.length; idx++) {
        const item = needSend[idx]
        const bot = ctx.bots[`${item.platform}:${item.selfId}`]
        if(!bot) {
          continue
        }
        let channel = false
        if(item.channelId) {
          channel = true
        }
        let image = renderMap(bsmap,ctx)
        console.log("send", bot.selfId, item.uid)
        const userId = item.uid?.split(":")
        const uid = userId[userId.length - 1]
        const channelId = item.channelId
        console.log("send", bot.selfId, item.uid, uid)

        const text = bot.session().text('ws.subscribe.update',
  {
            username:item.username,
            mapperName: bsmap.uploader.name
        })


        // const image= await ctx.puppeteer.render(await html)
        // const url = `${config.rankRenderURL}/render/map/${item.id}`
        // const buffer = await screenShot(ctx,url,'#render-result',()=>{},1000)
        // const image = h.image(buffer,'image/png')
        if(channel) {
          await bot.sendMessage(channelId, text)
          await bot.sendMessage(channelId, await image)
            .then(r => console.log("res:",r))
            .catch((e)=>console.log(e))
          await bot.sendMessage(channelId, h.audio(bsmap.versions[0].previewURL))
            .then(r => console.log("res:",r))
            .catch((e)=>console.log(e))
        }else {
          await bot.sendPrivateMessage(uid, text)
          await bot.sendPrivateMessage(uid, await image)
            .then(r => console.log("res:",r))
            .catch((e)=>console.log(e))
          await bot.sendPrivateMessage(uid, h.audio(bsmap.versions[0].previewURL))
            .then(r => console.log("res:",r))
            .catch((e)=>console.log(e))
        }
      }
    }
  })
}
