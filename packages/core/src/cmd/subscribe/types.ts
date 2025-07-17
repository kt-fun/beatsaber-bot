// 群聊内一次性的订阅
// 比如直接订阅某个 mapper 的 map
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
