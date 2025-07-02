import {Context, Session} from "koishi";
import { ChannelInfo, KoiRelateChannelInfo } from "@/types";
import { KoishiDB, KSession } from "@/service";
import { Config, getBot, Command } from "beatsaber-bot-core";
import { createServices } from "@/adatper/services";
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
      // @ts-ignore
      const [u, g] = await services.db.getUAndGBySessionInfo(session)
      // 2. get mentioned uids(exclude self & cur uid) and rest input
      const exclude = [session.uid, session.selfId]
      const [rest, mentions] = await transformInput(session, services.db, input, exclude)
      const lang = session.locales[0]
      const kSession = new KSession(session, u, g, lang, mentions, services.i18n, services.s3)
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
  // @ts-ignore
  const mentions = await db.batchGetOrCreateUBySessionInfo(sessions)
  return [rest.trim(), mentions]
}
