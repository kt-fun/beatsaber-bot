import {BizError} from "@/core";

export class RequestError extends BizError {
  static id = 'remote.network.request.error'
  id = RequestError.id
  constructor(params?: any) {
    super()
    this.params = params
  }
}

export class ReachNetworkRetryLimitError extends BizError {
  static id = 'remote.network.request.reach-retry-limit'
  id = ReachNetworkRetryLimitError.id
  constructor(params?: any) {
    super()
    this.params = params
  }
}
