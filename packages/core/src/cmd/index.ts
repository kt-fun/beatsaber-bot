
import { IdSearch } from './bsmap/id-search'
import { KeySearch } from './bsmap/key-search'
import { Latest } from './bsmap/latest'
import { Rank } from './rank'
import { Score } from './score'
import {subscribeCommands} from './subscribe'
import { Bind } from './bind'
import { Tmp } from './deprecated/tmp'

export const getCommands = () => {
  return [
    IdSearch,
    KeySearch,
    Latest,
    Rank,
    Score,
    Bind,
    ...subscribeCommands,
    Tmp,
  ]
}
