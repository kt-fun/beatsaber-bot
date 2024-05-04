import {Context, h} from 'koishi'
import {Config} from "./config";
import Cmd, {
  BindCmd,
  KeySearchCmd,
  IdSearchCmd,
  // SubscribeCmd,
  LatestCmd,
  MeCmd,
  RankCmd,
  WhoisCmd,
  // UnSubscribeCmd,
  CmpCmd,
  ScoreCmd, BindBSCmd
} from "./cmd";
import {} from 'koishi-plugin-puppeteer'
// import {pluginWebSocket} from "./ws";
import schedules from "./schedules";

export * from './config'


export const name = 'bs-bot'

export const inject = ['database','puppeteer']

declare module 'koishi' {
  interface Tables {
    // BeatSaverSubScribe: BeatSaverSubScribe,
    BeatSaverOAuthAccount: BeatSaverOAuthAccount,
    BeatSaverNotifySub:BeatSaverNotifySub,
    BeatSaverMapMessage:BeatSaverMapMessage,
  }
  interface User {
    bindSteamId: string
  }
}
export interface BeatSaverNotifySub {
  id: number,
  platform: string,
  // botId
  selfId: string,
  channelId: string|null,
  oauthAccountId: number,
  lastNotifiedAt: Date,
  lastNotifiedId: number
}
export interface BeatSaverOAuthAccount {
  id: number,
  uid: string,
  accessToken: string,
  refreshToken: string,
  scope: string,
  lastModifiedAt: Date,
  lastRefreshAt: Date,
  valid: string,
}
// interface BeatSaverSubScribe {
//   id: number,
//   platform: string,
//   selfId: string,
//   channelId: string|null,
//   uid: string,
//   username: string,
//   bsUserId: string,
//   time: Date,
//   bsUsername:string,
// }
interface BeatSaverMapMessage {
  id: number,
  platform: string,
  mapId: string,
  messageId: number,
}
function pluginInit(ctx: Context, config:Config) {
  const zhLocal = require('./locales/zh-CN')
  ctx.i18n.define('zh-CN', zhLocal)

  // ctx.model.extend('BeatSaverSubScribe', {
  //   id: 'unsigned',
  //   uid: 'string',
  //   username: 'string',
  //   channelId: 'string',
  //   selfId: 'string',
  //   platform: 'string',
  //   bsUserId: 'string',
  //   bsUsername: 'string',
  //   time: 'timestamp',
  // },{
  //   autoInc: true
  // })

  ctx.model.extend('BeatSaverNotifySub', {
    id: 'unsigned',
    channelId: 'string',
    selfId: 'string',
    platform: 'string',
    lastNotifiedId: 'unsigned',
    lastNotifiedAt: 'timestamp',
    oauthAccountId: 'unsigned',
  },{
    autoInc: true
  })

  ctx.model.extend('BeatSaverOAuthAccount', {
    id: 'unsigned',
    uid: 'string',
    accessToken: 'string',
    refreshToken: 'string',
    scope: 'string',
    lastModifiedAt: 'timestamp',
    lastRefreshAt: 'timestamp',
    valid: 'string'
  },{
    autoInc: true
  })

  ctx.model.extend('user', {
    bindSteamId: "string",
  })
}


export function apply(ctx: Context, config: Config) {
  pluginInit(ctx, config)
  pluginCmd(ctx, config)
  // pluginWebSocket(ctx,config)
  ctx.on('reaction-added', async (session) => {
    console.log('recv')
  })
  ctx.on('friend-request',async (session)=> {
    console.log("friend-request")
    await session.bot.handleFriendRequest(session.messageId,true)
    session.send(session.text('common.hello'))
    console.log("finished")
  })
  ctx.on('guild-request',async (param:any)=> {
    console.log(param)
  })

}



function pluginCmd(ctx: Context, config: Config) {
  const cmd = new Cmd(ctx,config)
  ctx.command('bsbot <prompt:string>')
  .alias('bb')
  .action(async ({ session, options }, input) => {
    const id = await session.send(input)
  })
  cmd
    .apply(KeySearchCmd)
    .apply(IdSearchCmd)
    .apply(LatestCmd)
    .apply(BindCmd)
    .apply(RankCmd)
    .apply(MeCmd)
    .apply(WhoisCmd)
    .apply(BindBSCmd)
    .apply(CmpCmd)
    .apply(ScoreCmd)
    // .apply(SubscribeCmd)
    // .apply(UnSubscribeCmd)
  schedules(ctx,config)
}
