import {$, Context, h} from "koishi";
import {Config} from "../config";
import {BeatSaverNotifySub, BeatSaverOAuthAccount} from "../index";
import {APIService} from "../service";
import {i} from "vite/dist/node/types.d-aGj9QkWt";
import {renderMap} from "../img-render";
interface Alert {
  id: number,
  head: string,
  body: string,
  type: string,
  time: string
}


interface BaseAlert {
  type: string
  id: number
  time: string,
  head: string,
  body: string,
}
interface FollowAlert extends BaseAlert {
  type:'Follow',
  followerId: number,
  followerName: string
}
interface MapCurationAlert extends BaseAlert {
  type:'MapCuration',
  mapId: number,
  curatorId: number,
  curatorName: string,
}
interface MapReleaseAlert extends BaseAlert {
  type:'MapRelease',
  mapId: string,
  uid: string,
  uname: string,
}


const AlertMonitor = (ctx:Context,config:Config,api:APIService) => async ()=> {
  const logger = ctx.logger('bs-bot.AlertMonitor');
  logger.info('trigger alertMonitor')
  const selection = ctx.database.join(['BeatSaverOAuthAccount','BeatSaverNotifySub'])
  const subscribe = await selection.where(row=>
    $.and($.eq(row.BeatSaverOAuthAccount.id,row.BeatSaverNotifySub.oauthAccountId),$.eq(row.BeatSaverOAuthAccount.valid,'ok'))).execute()
  const subscribes = subscribe.map(item=> ({
    sub: item.BeatSaverNotifySub,
    account:item.BeatSaverOAuthAccount
  }))
  for (const item of subscribes) {

  await handleOauthNotify(item, ctx,config, api)
  //
  }
}

export default AlertMonitor

const handleOauthNotify = async (item:{sub:BeatSaverNotifySub,account: BeatSaverOAuthAccount},ctx:Context,config:Config,api:APIService) => {
  const bot = ctx.bots[`${item.sub.platform}:${item.sub.selfId}`]
  if(!bot) {
    return
  }
  let alerts:Alert[]|null = await api.BeatSaver.getUnreadAlertsByPage(item.account.accessToken,0)
  let dbAccount = item.account
  if(!alerts) {
    const token = await api.AIOSaber.refreshOAuthToken(item.account.refreshToken)
    let now = new Date()
    if(!token) {
      dbAccount.valid = 'invalid'
      dbAccount.lastModifiedAt = now
      await ctx.database.upsert('BeatSaverOAuthAccount',[dbAccount])
      bot.sendMessage(item.sub.channelId, '似乎 BeatSaver 通知的 token 已经失效了，通过bbbindbs 重新绑定吧')
      return
    }
    dbAccount.accessToken = token.access_token
    dbAccount.refreshToken = token.refresh_token
    dbAccount.lastRefreshAt = now
    dbAccount.lastModifiedAt = now
    await ctx.database.upsert('BeatSaverOAuthAccount', [dbAccount])
    alerts = await api.BeatSaver.getUnreadAlertsByPage(dbAccount.accessToken,0)
  }
  const todo = alerts.filter(it=> item.sub.lastNotifiedId < it.id).sort((a,b)=> a.id - b.id)
  let res = Object.assign({}, item.sub)
  try {
    for (const it of todo) {
      const msg = await buildMessage(it, api,ctx,config)
      bot.sendMessage(item.sub.channelId, msg)
      res.lastNotifiedId = it.id
    }
  }catch (e) {
    console.log(e)
  }finally {
    ctx.database.upsert('BeatSaverNotifySub', [res])
  }
}
// @Joetastic just released #3c19b
const releasedRegex = /^(@\w+)\sjust\sreleased+\s#([a-f0-9]{1,5})/
const curatedRegex = /^(@\w+)\sjust\scurated+\s#([a-f0-9]{1,5})/
const followRegex = /^(@\w+)\s.+/
async function buildMessage (alert:Alert,api:APIService,ctx,cfg) {
  let msg = []
  if(alert.type === "MapRelease") {
    const [full, username, mapId] =  releasedRegex.exec(alert.body)
    const res = await api.BeatSaver.searchMapById(mapId)
    const image = await renderMap(res,ctx,cfg)
    msg = [`你关注的 ${username} 发布了新谱面`,
      h('message', [image])]
  }else if(alert.type === "MapCurated") {
    const [full, username, mapId] =  curatedRegex.exec(alert.body)
    const res = await api.BeatSaver.searchMapById(mapId)
    const image = await renderMap(res,ctx,cfg)
    msg = [`你关注的 ${username} 验证了新谱面`,
    h('message', [image])]
  }else if(alert.type === "Follow") {
    const [full, username] =  followRegex.exec(alert.body)
    msg = [`@${username} 刚刚关注你啦, https://beatsaver.com/profile/username/${username}`]
  }
  return h('message', msg)
}
