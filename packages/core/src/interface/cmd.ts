// eslint-disable
import { ImgRender } from './render'
import { Session } from './bot'
import { Logger } from './logger'
import { APIService } from '@/api'
import { DB } from '@/interface/db'
import { Config } from '@/config'

export interface CmdContext<CHANNEL, OPT> {
  render: ImgRender
  api: APIService
  logger: Logger
  db: DB<CHANNEL>
  config: Config
  session: Session
  options: OPT
  input: string
}

export type CmdExecutor<CHANNEL, OPT extends object = object> = (
  c: CmdContext<CHANNEL, OPT>
) => Promise<void>

export interface CmdOption {
  type: 'boolean' | 'number' | 'string' | 'null' | 'undefined'
  name: string
  short?: string
  description?: string
  required?: boolean
}

export type CmdAlias = {
  alias: string
  option?: object
}

export interface Command<CHANNEL> {
  name: string
  description: string
  aliases: CmdAlias[]
  options: CmdOption[]
  callback: CmdExecutor<CHANNEL>
  children: Command<CHANNEL>[]
}
