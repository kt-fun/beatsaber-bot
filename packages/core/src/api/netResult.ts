enum ReqResultStatus {
  Success,
  NotMatch,
  NetworkError,
}

export class NetReqResult<T> {
  data?: T | null
  private status: ReqResultStatus
  msg: string
  static failed<T>(reason: string): NetReqResult<T> {
    return new NetReqResult<T>(null, ReqResultStatus.NetworkError, reason)
  }
  static success<T>(data: T): NetReqResult<T> {
    return new NetReqResult(data, ReqResultStatus.Success, 'ok')
  }
  constructor(data: T, status: ReqResultStatus, message: string) {
    this.data = data
    this.status = status
    this.msg = message
  }

  successOr(data: T) {
    if (this.isSuccess()) {
      return this.data
    }
    return data
  }

  isSuccess() {
    return this.status === ReqResultStatus.Success
  }

  isNetworkError() {
    return this.status === ReqResultStatus.NetworkError
  }

  isNotMatch() {
    return this.status === ReqResultStatus.NotMatch
  }
}
