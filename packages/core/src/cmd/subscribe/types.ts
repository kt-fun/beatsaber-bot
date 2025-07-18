// 群聊内一次性的订阅
// 比如直接订阅某个 mapper 的 map
import {InvalidParamsError} from "@/services/errors";

export const idTypes = [
  'bsmap',
  'blscore',
  'lbrank',
]

// 群聊用户可以加入的群内的订阅组
// 比如直接订阅某个 mapper 的 map
export const groupTypes = [
  'bsmap-group',
  'blscore-group',
]

export const supportTypes = [
  ...idTypes,
  ...groupTypes,
]

export const getEventTypeBySubscriptionType = (t: string) => {
  switch (t) {
    case 'bsmap':
    case 'bsmap-group':
      return 'bsmap-update'
    case 'blscore':
    case 'blscore-group':
      return 'blscore-update'
    case 'lbrank':
      return 'schedule'
  }
  throw new InvalidParamsError({
    name: 'type',
    expect: supportTypes.toString(),
    actual: t
  })
}
