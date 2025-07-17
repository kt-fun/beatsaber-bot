import type { Channel, User, Config, Logger } from "@/index";
import {  getBot, createCommonService, getCommands, RenderService, APIService } from "@/index";
import {channels, defaultMock, MockData, seed, users} from "./mock-data";
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

export const createServices = async (filepath: string, cfg: Config, logger: Logger, data: MockData, memoryDB: boolean = false) => {
  const api = new APIService(cfg, logger)
  const db = await seed(memoryDB ? ':memory:' : path.join(filepath, 'sqlite.db'), data)
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

export type Sess = {
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



export const createCtx = async (filepath: string, mockData: MockData = defaultMock) => {
  const config = loadConfigFromFile()
  config.render = {
    ...config.render, mode: 'custom',
    // @ts-ignore
    render: mockImageRender
  }

  const services = await createServices(filepath, config, console, mockData, true)
  services.i18n = undefined
  const cmds = getCommands()

  const testCmd = async (name: string, opts?: CmdTestOpts) => {
    const options = opts?.options ?? {}
    const [input, ...rest] = opts?.inputs ?? []
    const logger = opts?.logger ?? console
    const cmd = cmds.find(it => it.name === name)
    if(!cmd) return []

    const user = opts?.sess?.user ?? mockData.sess.user
    const channel = opts?.sess?.channel ?? mockData.sess.channel
    const mentions = opts?.sess?.mentions ?? mockData.sess.mentions
    const locale = opts?.sess?.locale ?? mockData.sess.locale

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
    testEvent,
    db: services.db
  }
}
