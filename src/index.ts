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
  ScoreCmd, BindBSCmd, JoinSubscribeCmd, LeaveSubscribeCmd, HelpCmd
} from "./cmd";
import {} from 'koishi-plugin-puppeteer'
// import {pluginWebSocket} from "./ws";
import schedules from "./schedules";
import {pluginWS} from "./ws";
import {screenshotTmp} from "./img-render/rendertmp";

export * from './config'


export const name = 'bs-bot'

export const inject = ['database','puppeteer']

declare module 'koishi' {
  interface Tables {
    BSBotSubscribe: BSBotSubscribe,
    BSSubscribeMember: BSSubscribeMember,
    BeatSaverOAuthAccount: BeatSaverOAuthAccount,
    BeatSaverMapMessage:BeatSaverMapMessage,
  }
  interface User {
    bindSteamId: string
  }
}
export interface BeatSaverOAuthAccount {
  id: number,
  bsUserId: number,
  uid: number,
  accessToken: string,
  refreshToken: string,
  scope: string,
  lastModifiedAt: Date,
  lastRefreshAt: Date,
  valid: string,
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

  ctx.model.extend('BeatSaverOAuthAccount', {
    id: 'unsigned',
    // koishi uid
    uid: 'unsigned',
    bsUserId: 'unsigned',
    accessToken: 'string',
    refreshToken: 'string',
    scope: 'string',
    lastModifiedAt: 'timestamp',
    lastRefreshAt: 'timestamp',
    valid: 'string'
  },{
    autoInc: true
  })

  ctx.model.extend('BSSubscribeMember', {
    id: 'unsigned',
    subscribeId: 'unsigned',
    memberUid: 'unsigned',
    joinedAt: 'date',
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

  ctx.command('bsbot.tmplb')
    .alias('bblb')
    .action(async ({session}) => {
      const [hitbuf, scorebuf] = await Promise.all([
        screenshotTmp(ctx.puppeteer, 'https://aiobs.ktlab.io/tmp/lb/hitcnt', '#render-result'),
        screenshotTmp(ctx.puppeteer, 'https://aiobs.ktlab.io/tmp/lb/score', '#render-result')
      ])
      const hitmsg = h.image(hitbuf, 'image/png')
      const scoremsg = h.image(scorebuf, 'image/png')
      session.sendQueued(hitmsg)
      session.sendQueued(scoremsg)
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
    .apply(BindBSCmd)
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
