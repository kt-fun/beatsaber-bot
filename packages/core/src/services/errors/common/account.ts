import {BizError} from "@/core";

export class AccountBindingNotFoundError extends BizError {
  static id = 'common.account.bind.not-found'
  id = AccountBindingNotFoundError.id
  constructor(params: { platform: string, userId: string }) {
    super()
    this.params = params
  }
}
