import {$, Context, h} from "koishi";
import {Config} from "../config";
import {BeatSaverNotifySub, BeatSaverOAuthAccount} from "../index";
import {APIService} from "../service";
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
  logger.info(`handle ${subscribe.length} account's notification`)
  for (const item of subscribes) {
    await handleOauthNotify(item, ctx,config, api)
  }
}

export default AlertMonitor

const handleOauthNotify = async (item:{sub:BeatSaverNotifySub,account: BeatSaverOAuthAccount},ctx:Context,config:Config,api:APIService) => {
  const logger = ctx.logger('bs-bot.AlertMonitor.Handler');

  const bot = ctx.bots[`${item.sub.platform}:${item.sub.selfId}`]
  if(!bot) {
    logger.info('no bot found, skip')
    return
  }
  let alerts:Alert[]|null = await api.BeatSaver.getUnreadAlertsByPage(item.account.accessToken,0)
  let dbAccount = item.account
  if(!alerts) {
    logger.info('accessToken invalid, try to refresh')
    const token = await api.AIOSaber.refreshOAuthToken(item.account.refreshToken)
    let now = new Date()
    if(!token) {
      logger.info('failed to refresh, invalid this account')
      dbAccount.valid = 'invalid'
      dbAccount.lastModifiedAt = now
      await ctx.database.upsert('BeatSaverOAuthAccount',[dbAccount])
      bot.sendMessage(item.sub.channelId, '似乎 BeatSaver 通知的 token 已经失效了，通过bbbindbs 重新绑定吧')
      return
    }

    logger.info('refresh successfully')
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
      logger.info(`send alert id:${it.id}, type:${it.type}`)
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
const releasedRegex = /^@(\w+)\sjust\sreleased+\s#([a-f0-9]{1,5})/
const curatedRegex = /^@(\w+)\sjust\scurated+\s#([a-f0-9]{1,5})/
const followRegex = /^@(\w+)\s.+/
const selfMapCuratedRegex = /^(@\w+)\sjust\scurated+\s#([a-f0-9]{1,5})/
const selfMapUncuratedRegex = /^(@\w+)\sjust\suncrated\syour\smap\s#([a-f0-9]{1,5}):\s\*\*(.+)\*\*.+Reason:\s\*"(.+)"\*/
const selfMapDeletionRegex = /^Your map #([a-f0-9]{1,5}):.+Reason:\s\*"(.+)"\*$/
async function buildMessage (alert:Alert,api:APIService,ctx,cfg) {
  let msg = []
  if(alert.type === "MapRelease") {
    const [full, username, mapId] =  releasedRegex.exec(alert.body)
    const res = await api.BeatSaver.searchMapById(mapId)
    const image = await renderMap(res,ctx,cfg)
    msg = [`你关注的 ${username} 发布了新谱面`,
      h('message', [image]),h('audio',{src: res.versions[0].previewURL})
    ]
  }else if(alert.type === "MapCurated") {
    const [full, username, mapId] =  curatedRegex.exec(alert.body)
    const res = await api.BeatSaver.searchMapById(mapId)
    const image = await renderMap(res,ctx,cfg)
    msg = [`你关注的 ${username} Curate 了新谱面`,
      h('message', [image]),h('audio',{src: res.versions[0].previewURL})

    ]
  }else if(alert.type === "Curation") {
    const [full, username, mapId] =  selfMapCuratedRegex.exec(alert.body)
    const res = await api.BeatSaver.searchMapById(mapId)
    const image = await renderMap(res,ctx,cfg)
    msg = [`🎉，@${username} 刚刚 Curate 了你新谱面 ${mapId}`,
      h('message', [image]),h('audio',{src: res.versions[0].previewURL})
    ]
  }
  else if(alert.type === "Uncuration") {
    const [full, username, mapId, name, reason] =  selfMapUncuratedRegex.exec(alert.body)
    const res = await api.BeatSaver.searchMapById(mapId)
    const image = await renderMap(res,ctx,cfg)
    msg = [`@${username} 刚刚 Uncurate 了你的谱面 ${mapId}，原因：${reason}`,
      h('message', [image]),h('audio',{src: res.versions[0].previewURL})
    ]
  }
  else if(alert.type === "Deletion") {
    const [full,mapId, reason] =  selfMapDeletionRegex.exec(alert.body)
    msg = [`你的谱面 ${mapId} 被移除了，原因：${reason}`]
  }
  else if(alert.type === "Follow") {
    const [full, username] =  followRegex.exec(alert.body)
    msg = [`@${username} 刚刚关注你啦, https://beatsaver.com/profile/username/${username}`]
  }
  else if(alert.type === "Review") {
    const [full, username,mapId, mapName, review] =  reviewRegex.exec(alert.body)
    const res = await api.BeatSaver.searchMapById(mapId)
    const image = await renderMap(res,ctx,cfg)
    msg = [`@${username} 刚刚在你的谱面${mapName}(${mapId})中发表了评论：${review}`,
      h('message', [image]),h('audio',{src: res.versions[0].previewURL})
    ]
  }
  else if(alert.type === "ReviewDeletion") {
    const [full, mapId,reason] =  selfReviewDeletionRegex.exec(alert.body)
    msg = [`你在谱面 ${mapId} 中的评论被移除了，原因：${reason}`]
  }
  return h('message', msg)
}

const reviewRegex = /^(@\w+)\sjust\sreviewed\syour\smap\s#([a-f0-9]{1,5}):\s\*\*(.+)\*\*\..+\*"(.+)"\*/
const selfReviewDeletionRegex = /^A\smoderator\sdeleted\syour\sreview\son\s#([a-f0-9]{1,5}).+Reason:\s\*"(.+)"\*$/
