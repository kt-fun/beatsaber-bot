
import IdSearch from './bsmap/id-search'
import KeySearch from './bsmap/key-search'
import Latest from './bsmap/latest'
import Rank from './rank'
import Score from './score'
import Subscribe from './subscribe'
import Subjoin from './subscribe/subjoin'
import Subleave from './subscribe/subleave'
import Unsubscribe from './subscribe/unsubscribe'
import Bind from './bind'
import Tmp from './deprecated/tmp'
import {Command} from "@/interface";

function applyCommand(...fns: (() => Command)[]) {
  return fns.map((fn) => fn())
}

export const botCommands = () =>
  applyCommand(
    IdSearch,
    KeySearch,
    Latest,
    Rank,
    Score,
    Bind,
    Subscribe,
    Subjoin,
    Subleave,
    Unsubscribe,
    Tmp,
    // Config
  )

//transport
