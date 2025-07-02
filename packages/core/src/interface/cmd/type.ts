// import { ImgRender } from './render'
// import { Session } from './bot'

import { DB } from '@/interface/db'
import { Config } from '@/config'
import {Logger, Session} from "@/interface";
import {Services} from "@/service";

export interface CmdContext<CHANNEL, OPT> {
  logger: Logger
  config: Config
  session: Session
  options: OPT
  services: Services<CHANNEL>
  input: string
}

type SessionContext<OPT> = {
  session: any
  user: any
  input: {
    options: OPT
    text?: string
  }
}

// di framework

export type CmdExecutor<CHANNEL, OPT extends object = object> = (
  c: CmdContext<CHANNEL, OPT>
) => Promise<void>

export interface CmdOption {
  type: 'boolean' | 'number' | 'string'
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

export type Extend<BASE extends {}, N extends string, D> = {
  [P in N | keyof BASE]?: (P extends keyof BASE ? BASE[P] : unknown) &
    (P extends N ? D : unknown)
}

type ExtractType<T extends string> = T extends 'string'
  ? string
  : T extends 'boolean'
    ? boolean
    : T extends 'number'
      ? number
      : any

type Nullable<T> = T | null

type ExtractNullSafeType<T extends string> = T extends `${infer Type}?`
  ? Nullable<ExtractType<Type>>
  : ExtractType<T>
// paramName:typename?
// eg: online:boolean?
export type OptionType<T extends string> = T extends `${infer L}:${infer R}`
  ? ExtractNullSafeType<R>
  : unknown
