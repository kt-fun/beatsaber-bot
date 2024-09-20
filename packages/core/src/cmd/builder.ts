import { CmdAlias, CmdContext, CmdExecutor, CmdOption } from '@/interface/cmd'
import { BizError } from '@/errors'

type Extend<BASE extends {}, N extends string, D> = {
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
type OptionType<T extends string> = T extends `${infer L}:${infer R}`
  ? ExtractNullSafeType<R>
  : unknown

export class CommandBuilder<CHANNEL, OPT extends {} = {}> {
  private name: string
  private description: string
  private options: CmdOption[] = []
  private aliases: CmdAlias[] = []
  addOption<N extends string, D extends string>(name: N, description: D) {
    this.options.push({
      name: name,
      description: description,
      type: 'string',
    })
    return this as CommandBuilder<CHANNEL, Extend<OPT, N, OptionType<D>>>
  }

  addAlias(alias: string, option?: object) {
    this.aliases.push({ alias, option })
    return this
  }
  setName<T extends string>(name: T) {
    this.name = name
    return this
  }
  setDescription(description: string) {
    this.description = description
    return this
  }
  setExecutor(executor: CmdExecutor<CHANNEL, OPT>) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this
    const errorHandler = (executor: CmdExecutor<CHANNEL, OPT>) => {
      return async (c: CmdContext<CHANNEL, OPT>) => {
        try {
          await executor(c)
        } catch (e: any) {
          if (e instanceof BizError) {
            await c.session.send(c.session.text(e.id, e.params))
          } else {
            c.logger.error(
              `unexpectError occur during cmd 「${that.name}」executing`,
              e
            )
            c.session.send(
              'An unexpected error occurs, reporting it may help to fix it.'
            )
          }
        }
      }
    }

    return {
      name: this.name,
      description: this.description,
      aliases: this.aliases,
      options: this.options,
      callback: errorHandler(executor),
      children: [],
    }
  }
}
