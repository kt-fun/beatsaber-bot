import { Command } from '@/interface/cmd'
import Help from '@/cmd/help'
import IdSearch from '@/cmd/id-search'
import KeySearch from '@/cmd/key-search'
import Latest from '@/cmd/latest'
import Me from '@/cmd/me'
import Rank from '@/cmd/rank'
import Score from '@/cmd/score'
import Whois from '@/cmd/whois'
import Subscribe from '@/cmd/subscribe'
import Subjoin from '@/cmd/subscribe/subjoin'
import Subleave from '@/cmd/subscribe/subleave'
import Unsubscribe from '@/cmd/subscribe/unsubscribe'
import Tmp from '@/cmd/tmp'
import Bind from '@/cmd/bind'

function applyCommand<CHANNEL>(...fns: (() => Command<CHANNEL>)[]) {
  return fns.map((fn) => fn())
}

export const botCommands = <CHANNEL>() =>
  applyCommand<CHANNEL>(
    Help,
    IdSearch,
    KeySearch,
    Latest,
    Me,
    Rank,
    Score,
    Whois,
    Bind,
    Subscribe,
    Subjoin,
    Subleave,
    Unsubscribe,
    Tmp
  )
