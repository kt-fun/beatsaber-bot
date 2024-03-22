import {h} from "koishi";

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
