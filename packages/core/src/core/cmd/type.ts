import { Logger } from "../logger";
import {PassiveSession} from "../session";

export interface CmdContext<Service, Cfg, OPT> {
  logger: Logger
  session: PassiveSession
  config: Cfg
  services: Service
  options: OPT
  input?: string
}

export type CmdExecutor<Service, Cfg, OPT> = (
  c: CmdContext<Service, Cfg, OPT>
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
  option?: {}
}

export interface Command<Service, Cfg, OPT> {
  name: string
  description: string
  aliases: CmdAlias[]
  options: CmdOption[]
  callback: CmdExecutor<Service, Cfg, OPT>
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
