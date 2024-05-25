import {Context, h} from 'koishi'
import {Config} from "./config";
import Cmd, {
  BindCmd,
  KeySearchCmd,
  IdSearchCmd,
  SubscribeCmd,
  LatestCmd,
  MeCmd,
  RankCmd,
  WhoisCmd,
  UnSubscribeCmd,
  CmpCmd,
  ScoreCmd, JoinSubscribeCmd, LeaveSubscribeCmd, HelpCmd
} from "./cmd";
import {} from 'koishi-plugin-puppeteer'
import {} from 'koishi-plugin-cron'
import {} from './utils/extendedMethod'
import schedules from "./schedules";
import {pluginWS} from "./ws";
import {screenshotTmp} from "./img-render/rendertmp";

export * from './config'

export const name = 'bs-bot'

export const inject = ['database','puppeteer','cron']

declare module 'koishi' {
  interface Session {
    sendQuote: (text: string)=> Promise<string[]>
  }
  interface Tables {
    BSBotSubscribe: BSBotSubscribe,
    BSSubscribeMember: BSSubscribeMember,
    BSRelateOAuthAccount: BSRelateOAuthAccount
    BeatSaverMapMessage:BeatSaverMapMessage,
  }
  interface User {
    bindSteamId: string
  }
}


export interface BSRelateOAuthAccount {
  id: number,
  uid: number,
  platform: string,
  platformUid: string,
  platformScope: string,
  platformUname: string,
  otherPlatformInfo: any,
  accessToken: string,
  refreshToken: string,
  lastModifiedAt: Date,
  lastRefreshAt: Date,
  valid: string,
  type: string,
}

interface BSBotSubscribe {
  id: number,
  platform: string,
  selfId: string,
  channelId: string|null,
  enable: boolean,
  uid: string,
  time: Date,
  type: string,
  data: {
    [key: string]: any
  }
}

interface BSSubscribeMember {
  id: number,
  subscribeId: number,
  memberUid: number,
  subscribeData: any,
  joinedAt: Date,
}

interface BeatSaverMapMessage {
  id: number,
  platform: string,
  mapId: string,
  messageId: number,
}
function pluginInit(ctx: Context, config:Config) {
  const zhLocal = require('./locales/zh-CN')
  ctx.i18n.define('zh-CN', zhLocal)

  ctx.model.extend('BSBotSubscribe', {
    id: 'unsigned',
    uid: 'string',
    channelId: 'string',
    selfId: 'string',
    platform: 'string',
    enable: 'boolean',
    type: 'string',
    data: 'json'
  },{ autoInc: true })

  ctx.model.extend('BSRelateOAuthAccount', {
    id: 'unsigned',
    uid: 'unsigned',
    platform: 'string',
    platformUid: 'string',
    platformScope: 'string',
    platformUname: 'string',
    otherPlatformInfo: 'json',
    accessToken: 'string',
    refreshToken: 'string',
    lastModifiedAt: 'timestamp',
    lastRefreshAt: 'timestamp',
    type: 'string',
    valid: 'string'
  },{
    autoInc: true
  })

  ctx.model.extend('BSSubscribeMember', {
    id: 'unsigned',
    subscribeId: 'unsigned',
    memberUid: 'unsigned',
    subscribeData: 'json',
    joinedAt: 'date',
  },{
    autoInc: true
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


async function sendTmpHit(ctx,session) {
  const buf = await screenshotTmp(ctx.puppeteer, 'https://aiobs.ktlab.io/tmp/lb/hitcnt', '#render-result', ()=> {
    session.sendQueued(h('message', [
      "开始渲染砍击榜了，请耐心等待 10s"
    ]))
  },8000)
  const hitmsg = h.image(buf, 'image/png')
  session.sendQueued(hitmsg)
}
async function sendTmpScore(ctx,session) {
  const buf = await screenshotTmp(ctx.puppeteer, 'https://aiobs.ktlab.io/tmp/lb/score', '#render-result', ()=> {
    session.sendQueued(h('message', [
      "开始渲染打分榜了，请耐心等待 10s"
    ]))
  },8000)
  const scoremsg = h.image(buf, 'image/png')
  session.sendQueued(scoremsg)
}
function pluginCmd(ctx: Context, config: Config) {
  const cmd = new Cmd(ctx,config)

  ctx.command('bsbot.tmplb')
    .alias('bblb')
    .action(async ({session}) => {
      await Promise.all([sendTmpHit(ctx,session), sendTmpScore(ctx,session)])
    })
  ctx.command('bsbot <prompt:string>')
  .alias('bb')
  .action(async ({ session, options }, input) => {
    session.send(input)
  })
  cmd
    .apply(KeySearchCmd)
    .apply(IdSearchCmd)
    .apply(LatestCmd)
    .apply(BindCmd)
    .apply(RankCmd)
    .apply(MeCmd)
    .apply(WhoisCmd)
    .apply(HelpCmd)
    .apply(CmpCmd)
    .apply(ScoreCmd)
    .apply(SubscribeCmd)
    .apply(UnSubscribeCmd)
    .apply(JoinSubscribeCmd)
    .apply(LeaveSubscribeCmd)
  schedules(ctx,config)
  pluginWS(ctx, config)
}
