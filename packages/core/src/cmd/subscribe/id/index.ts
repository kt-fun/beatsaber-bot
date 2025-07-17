import {CmdContext} from "@/interface";
import { idTypes } from "@/cmd/subscribe/types";
import {InvalidParamsError} from "@/services/errors";
import {subscribeBSMap} from "@/cmd/subscribe/id/bsmap";
import {subscribeBLScore} from "@/cmd/subscribe/id/blscore";
import {subById} from "@/cmd/subscribe/id/common";

export const subscribeId = async (c: CmdContext<{t?: string}>) => {
  const t = c.options.t
  if(!idTypes.includes(t)) throw new InvalidParamsError({
    name: "type",
    expect: idTypes.toString(),
    actual: t
  })
  switch (t) {
    case 'bsmap':
      return subscribeBSMap(c)
    case 'blscore':
      return subscribeBLScore(c)
    case 'lbrank':
      const id = `${t}::${c.session.channel.id}`
      return subById(c,  id, 'lbrank', {})
  }
}
