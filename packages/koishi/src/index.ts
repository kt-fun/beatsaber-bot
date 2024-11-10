import { Context, Session } from 'koishi'
import {} from 'koishi-plugin-cron'
import {
  botCommands,
  Command,
  Config,
  APIService,
  TmpFileStorage,
  UserPreferenceStore,
} from 'beatsaber-bot-core'
import { ChannelInfo, KoiRelateChannelInfo } from '@/types'
import { InitDBModel, KoishiDB } from '@/service'
import { KSession } from '@/service'
import { ImgRender } from '@/service'
import { loadWS } from '@/service'
import { loadSchedule } from '@/service'
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
  const registerCmd = registerFn(ctx, config)
  botCommands<ChannelInfo>().map(registerCmd)
  ctx
    .command('bsbot <prompt:string>')
    .alias('bb')
    .action(async ({ session, options }, input) => {
      await session.send(input)
    })
}

const registerFn = (ctx: Context, config: Config) => {
  const db = new KoishiDB(ctx)
  const api = APIService.create(config)
  // @ts-ignore
  const logger = ctx.logger('beats-bot.cmd')
  const render = new ImgRender(config, api, ctx)
  let tmpStorage
  if (config.uploadImageToS3.enable) {
    tmpStorage = new TmpFileStorage(config)
  }
  return (c: Command<ChannelInfo>) => {
    let cmd = ctx.command(`bsbot.${c.name}`)

    cmd = c.aliases.reduce(
      (acc, alias) =>
        alias.option
          ? acc.alias(alias.alias, alias.option)
          : acc.alias(alias.alias),
      cmd
    )

    cmd = c.options.reduce(
      (acc, option) =>
        acc.option(option.name, extractKoiOptionDesc(option.description)),
      cmd
    )

    cmd.action(async ({ session, options }, input) => {
      const [u, g] = await db.getUAndGBySessionInfo(session)
      // 2. get mentioned uids(exclude self & cur uid) and rest input
      const exclude = [session.uid, session.selfId]
      const [rest, mentions] = await transformInput(session, db, input, exclude)
      const lang = session.locales[0]
      const kSession = new KSession(session, u, g, lang, mentions, tmpStorage)
      const userPreference = new UserPreferenceStore(db, u.id)
      const ctx = {
        api: api,
        logger: logger,
        db: db,
        config: config,
        session: kSession,
        render: render,
        userPreference: userPreference,
        options: options,
        s3: tmpStorage,
        input: rest,
      }
      await c.callback(ctx)
    })
  }
}

const regex = /^(.+):(.+?)\??$/
function extractKoiOptionDesc(description: string) {
  let desc = description
  const [, fullname, type] = regex.exec(desc)
  const optional = desc.endsWith('?')
  desc = `${fullname}:${type}`
  desc = optional ? `[${desc}]` : `<${desc}>`
  return desc
}

const mentionRegex = /<\s?at\sid="(\w+)"\s?\/?>/g

async function transformInput(
  session: Session,
  db: KoishiDB,
  input: string,
  exclude: string[]
): Promise<[string, KoiRelateChannelInfo[]]> {
  if (!input) {
    return ['', []]
  }
  const mentioned = input.match(mentionRegex)
  const rest = input.replace(mentionRegex, ' ')
  const mentionsStr =
    mentioned
      ?.map((it) => mentionRegex?.exec(it))
      ?.map((it) => it?.[1])
      ?.filter((it) => !exclude.includes(it)) ?? []
  // db: batch get uid by strings and sessions info
  // if user not exist, then create it
  // query db and convert it to uid
  const sessions = mentionsStr.map((it) => ({
    ...session,
    uid: `${session.platform}:${it}`,
  }))
  // 得到所有 mention
  const mentions = await db.batchGetOrCreateUBySessionInfo(sessions)

  return [rest.trim(), mentions]
}

async function transform2(session: Session, db: KoishiDB) {
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
  const kSession = new KSession(session, u, g, 'zh-cn', mentions)
}
