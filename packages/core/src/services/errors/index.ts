import { BizError } from "@/core"

export * from './remote'
export * from './input'
export * from './local'

export class NotImplementedError extends BizError {
  static id = 'commands.bsbot.common.error.not-implemented'
  id = NotImplementedError.id
  constructor(params?: { feature: string }) {
    super()
    this.params = params
  }
}
