import type { Channel, User, Config, Logger } from "@/index";
import {  getBot, createCommonService, getCommands, RenderService, APIService } from "@/index";
import {channels, seed, users} from "~/mock/data";
import {loadConfigFromFile} from "./config";
import {TestAgentService} from "./session/agent";
import {TestPassiveSession} from "./session/passive-session";

import path from "path";

const mockImageRender = {
  html2img: (html: string, opt: any) => {
    return Promise.resolve(Buffer.from(html))
  },
  url2img: (url: string, opt: any) => {
    return Promise.resolve(Buffer.from(url))
  },
}

export const createServices = async (filepath: string, cfg: Config, logger: Logger) => {
  const api = new APIService(cfg, logger)
  const db = await seed(path.join(filepath, 'sqlite.db'))
  const render = RenderService.create({
    ...cfg.render,
    logger,
    api,
    render: mockImageRender
  })
  const svc = createCommonService(cfg, logger)
  return {
    ...svc,
    render,
    db,
  }
}

type Sess = {
  user?: User,
  channel?: Channel,
  mentions?: User[]
  locale?: string
}

type CmdTestOpts = {
  inputs?: string[]
  options?: Record<string, any>
  logger?: Logger,
  sess?: Sess
//   logger, session, options
}

const sess: Sess = {
  user: users[0],
  channel: channels[0],
  mentions: [],
  locale: 'zh-CN'
}

const createBot = async (filepath: string) => {
  const config = loadConfigFromFile()
  const services = await createServices(filepath, config, console)
  const bot = getBot({
    config,
    services,
    agentService: new TestAgentService(filepath),
  })
  return bot
}


export const createCtx = async (filepath: string, defaultSess: Sess = sess) => {
  const config = loadConfigFromFile()
  config.render = {
    ...config.render, mode: 'custom',
    // @ts-ignore
    render: mockImageRender
  }

  const services = await createServices(filepath, config, console)


  const cmds = getCommands()

  const testCmd = async (name: string, opts?: CmdTestOpts) => {
    const options = opts?.options ?? {}
    const [input, ...rest] = opts?.inputs ?? []
    const logger = opts?.logger ?? console
    const cmd = cmds.find(it => it.name === name)
    if(!cmd) return []

    const user = opts?.sess?.user ?? defaultSess.user
    const channel = opts?.sess?.channel ?? defaultSess.channel
    const mentions = opts?.sess?.mentions ?? defaultSess.mentions
    const locale = opts?.sess?.locale ?? defaultSess.locale

    const session = new TestPassiveSession(filepath, rest, {
      user,
      channel,
      mentions,
      lang: locale,
      i18n: services?.i18n,
      s3: services.s3
    })

    await cmd.callback({
      config,
      services,
      input: input ?? '',
      session,
      options,
      logger
    })
    return session.output
  }

  const testEvent = async (event) => {
    const agent = new TestAgentService(filepath)
    const bot = getBot({
      config,
      services,
      agentService: agent,
    })
    await bot.eventHandlers.handleEvent(event)
    return agent?.session?.output ?? []
  }

  return {
    testCmd,
    testEvent
  }
}
