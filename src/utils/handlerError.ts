import {h, SessionError} from "koishi";

enum ReqResultStatus {
  Success,
  NotMatch,
  NetworkError
}

class NetReqResult<T> {
  data:T
  private status: ReqResultStatus
  constructor(data:T,status:ReqResultStatus) {
    this.data = data
    this.status = status
  }
  successOr(data:T) {
    if(this.isSuccess()) {
      return this.data
    }
    return data
  }
  isSuccess () {
    return this.status === ReqResultStatus.Success
  }

  isNetworkError() {
    return this.status === ReqResultStatus.NetworkError
  }

  isNotMatch() {
    return this.status === ReqResultStatus.NotMatch
  }

}

export default async function handlerError<T>(session,block:()=>T) {
  let times = 3
  let result = null
  while (times > 0) {
    try {
      result = await block()
      return result satisfies T
    }catch (e) {
      if(times-- > 1) continue
      const text = session.text('commands.bsbot.bind.network-error')
      session.send(h('message',
        h('quote', {id: session.messageId}),
        text
      ))
      return undefined
    }
  }
  return result
}
