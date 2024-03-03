import {Context, h} from 'koishi'
import {Config} from "./config";
import Cmd, {BindCmd, KeySearchCmd, IdSearchCmd, SubscribeCmd, LatestCmd, RankCmd, MeCmd, WhoisCmd} from "./cmd";
import {} from 'koishi-plugin-puppeteer'
import {pluginWebSocket} from "./ws";


export * from './config'


export const name = 'bs-bot'

export const inject = ['database','puppeteer']

declare module 'koishi' {
  interface Tables {
    BSaverSubScribe: BSaverSubScribe,
  }
  interface User {
    bindId: string
  }
}

interface BSaverSubScribe {
  id: number,
  platform: string,
  selfId: string,
  channelId: string|null,
  uid: string,
  username: string,
  bsUserId: string,
  time: Date,
  bsUsername:string,
  bsUserDesc: string,
}

function pluginInit(ctx: Context, config:Config) {
  const zhLocal = require('./locales/zh-CN')
  ctx.i18n.define('zh-CN', zhLocal)
  ctx.model.extend('BSaverSubScribe', {
    // 各字段的类型声明
    id: 'unsigned',
    uid: 'string',
    username: 'string',
    channelId: 'string',
    selfId: 'string',
    platform: 'string',
    bsUserId: 'string',
    bsUsername: 'string',
    bsUserDesc: 'string',
    time: 'timestamp',
  },{
    autoInc: true
  })
  ctx.model.extend('user', {
    bindId: "string"
  })
}


export function apply(ctx: Context, config: Config) {
  pluginInit(ctx, config)
  pluginWebSocket(ctx,config)
  pluginCmd(ctx, config)
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
  ctx.command('bsbot <prompts:text>')
  .alias('bbt')
  .action(async ({ session, options }, input) => {
    console.log("action")
    session.send(input)
  })
  cmd
    .apply(SubscribeCmd)
    .apply(KeySearchCmd)
    .apply(IdSearchCmd)
    .apply(LatestCmd)
    .apply(BindCmd)
    .apply(RankCmd)
    .apply(MeCmd)
    .apply(WhoisCmd)
}
