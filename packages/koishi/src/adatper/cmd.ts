import {Context, Session, } from "koishi";
import { KoishiDB, } from "./db";
import { KSession } from './session'
import { Config, getBot, Command, User } from "beatsaber-bot-core";
import { createServices } from "./services";
import {AgentHolder} from "@/adatper/agent";


export function loadCmd(ctx: Context, config: Config) {
  const registerCmd = registerFn(ctx, config)
  getBot(config).commands.map(registerCmd)
  ctx
    .command('bsbot <prompt:string>')
    .alias('bb')
    .action(async ({session, options}, input) => {
      await session.send(input)
    })
}

const registerFn = (ctx: Context, config: Config) => {
  const logger = ctx.logger('beats-bot.cmd')
  const services = createServices(ctx, config, logger)
  const agentHolder = new AgentHolder(ctx)
  return (c: Command) => {
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
      const {user, channel} = await services.db.getUAndGBySessionInfo(session)
      await agentHolder.registerAgentAndChannel(session, channel)
      const exclude = [session.uid, session.selfId]
      const [rest, mentions] = await transformInput(session, services.db, input, exclude)
      const lang = session.locales[0]
      const kSession = new KSession(session, user, channel, mentions, lang, services.i18n, services.s3)
      // const userPreference = new UserPreferenceStore(db, u.id)
      const ctx = {
        logger: logger,
        services: services,
        config: config,
        session: kSession,
        options: options,
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
): Promise<[string, User[]]> {
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
  const sessions = mentionsStr.map((it) => ({
    ...session,
    uid: `${session.platform}:${it}`,
  }))
  const mentions = await db.batchGetOrCreateUBySessionInfo(sessions)
  return [rest.trim(), mentions]
}
