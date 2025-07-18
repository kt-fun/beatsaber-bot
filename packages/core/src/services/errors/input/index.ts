import {BizError} from "@/core";

export class InvalidParamsError extends BizError {
  static id = 'input.error.invalid-params'
  id = InvalidParamsError.id
  constructor(params: { name: string, expect?: string, actual: string }) {
    super()
    this.params = params
  }
}

export class MissingParamsError extends BizError {
  static id = 'input.error.missing-params'
  id = MissingParamsError.id
  constructor(params: { name: string, example?: string }) {
    super()
    this.params = params
  }
}
