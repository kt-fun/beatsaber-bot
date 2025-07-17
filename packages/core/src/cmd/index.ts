
import IdSearch from './bsmap/id-search'
import KeySearch from './bsmap/key-search'
import Latest from './bsmap/latest'
import Rank from './rank'
import Score from './score'
import {subscribeCommands} from './subscribe'
import Bind from './bind'
import Tmp from './deprecated/tmp'
import {Command} from "@/interface";

function applyCommand(...fns: (() => Command)[]) {
  return fns.map((fn) => fn())
}

export const getCommands = () =>
  applyCommand(
    IdSearch,
    KeySearch,
    Latest,
    Rank,
    Score,
    Bind,
    ...subscribeCommands,
    Tmp,
  )
