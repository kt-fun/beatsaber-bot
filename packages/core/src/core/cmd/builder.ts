import type { CmdAlias, CmdContext, CmdExecutor, CmdOption, OptionType, Extend } from './type'
import { BizError } from '../error'
import {typeid} from "typeid-js";

export class CommandBuilder<Service, Config, OPT extends {} = {}> {
  private name: string
  private description: string
  private options: CmdOption[] = []
  private aliases: CmdAlias[] = []

  constructor() {}

  addOption<N extends string, D extends string>(name: N, description: D) {
    this.options.push({
      name: name,
      description: description,
      type: 'string',
    })
    return this as CommandBuilder<Service, Config, Extend<OPT, N, OptionType<D>>>
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

  setExecutor(executor: CmdExecutor<Service, Config, OPT>) {
    const that = this
    const errorHandler = (executor: CmdExecutor<Service, Config, OPT>) => {
      return async (c: CmdContext<Service, Config, OPT>) => {
        const traceId = typeid('trace').toString()
        try {
          await executor(c)
        } catch (e: any) {
          if (e instanceof BizError) {
            // @ts-ignore
            await c.session.send(c.session.text(e.id, e.params))
          } else {
            c.logger.error(
              `unexpectError occur during cmd 「${that.name}」executing`,
              e
            )
            await c.session.send(
              c.session.text('command.error.unknown-error', { traceId }),
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
