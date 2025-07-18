import {BizError} from "@/core";

export class NoneSubscriptionError extends BizError {
  static id = 'common.subscription.empty'
  id = NoneSubscriptionError.id
  constructor() {
    super()
    this.params = {}
  }
}

export class SubscriptionNotExistError extends BizError {
  static id = 'common.subscription.not-found'
  id = SubscriptionNotExistError.id
  constructor(params: { type: string, channelId: string, id?: string}) {
    super()
    this.params = params
  }
}

