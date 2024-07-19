import { Context } from 'koishi'
import {} from 'koishi-plugin-cron'
import { botCommands, Command, Config } from 'beatsaber-bot-core'
import { ChannelInfo } from '@/types'
import { InitDBModel, KoishiDB } from '@/service/db'
import { APIService } from 'beatsaber-bot-core'
import { KSession } from '@/session-impl'
import { ImgRender } from '@/service'
import { loadWS } from '@/ws'
import { loadSchedule } from '@/schedule'
export * from './config'

export const name = 'beatsaber-bot'

export const inject = ['database', 'puppeteer', 'cron']

export function apply(ctx: Context, config: Config) {
  // const zhLocal = require('./locales/zh-CN')
  // ctx.i18n.define('zh-CN', zhLocal)
  InitDBModel(ctx)
  loadCmd(ctx, config)
  loadWS(ctx, config)
  loadSchedule(ctx, config)
}

function loadCmd(ctx: Context, config: Config) {
  botCommands<ChannelInfo>().forEach((c: Command<ChannelInfo>) => {
    let cmd = ctx.command(`bsbot.${c.name}`)
    for (const alias of c.aliases) {
      if (alias.option) {
        cmd = cmd.alias(alias.alias, alias.option)
      } else {
        cmd = cmd.alias(alias.alias)
      }
    }
    for (const option of c.options) {
      let desc = option.description
      const regex = /^(.+):(.+?)\??$/
      const [, fullname, type] = regex.exec(desc)
      const optional = desc.endsWith('?')
      desc = `${fullname}:${type}`
      desc = optional ? `[${desc}]` : `<${desc}>`
      cmd = cmd.option(option.name, desc)
    }
    const db = new KoishiDB(ctx)
    const api = APIService.create(config)
    // @ts-ignore
    const logger = ctx.logger('beats-bot.cmd')
    const render = new ImgRender(config, api, ctx)
    cmd.action(async ({ session, options }, input) => {
      // create user
      const s = {
        uid: session.uid,
        channelId: session.channelId,
        selfId: session.selfId,
        platform: session.platform,
      }
      const mentionReg = /<at\s+id="(\w+)"\/>/
      let content = session.content
      const ids = []
      let match
      while ((match = mentionReg.exec(content)) !== null) {
        ids.push(match[1])
        content = content.replace(match[0], '')
      }
      const idChans = ids
        .filter((it) => it.uid == session.selfId)
        .map((id) => ({
          uid: id,
          channelId: session.channelId,
          selfId: session.selfId,
          platform: session.platform,
        }))
      const uags = idChans.map((idChan) => {
        return db.getUAndGBySessionInfo(idChan)
      })
      const [u, g] = await db.getUAndGBySessionInfo(s)
      const mentions = (await Promise.all(uags)).map((it) => it?.[0])
      const kSession = new KSession(session, u, g, mentions)
      const ctx = {
        api: api,
        logger: logger,
        db: db,
        config: config,
        session: kSession,
        render: render,
        options: options,
        input: input,
      }
      await c.callback(ctx)
    })
  })
  ctx
    .command('bsbot <prompt:string>')
    .alias('bb')
    .action(async ({ session, options }, input) => {
      session.send(input)
    })
}
