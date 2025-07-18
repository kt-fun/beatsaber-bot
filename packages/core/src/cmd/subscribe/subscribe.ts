import { CommandBuilder } from "@/interface";
import {InvalidParamsError } from '@/services/errors'
import {groupTypes, idTypes, supportTypes} from "./types";
import {subscribeId} from "./id";
import {subscribeGroup} from "./group";
import {showSubscriptions} from "@/cmd/subscribe/info";

export const Subscribe = new CommandBuilder()
    .setName('subscribe')
    .addAlias('bbsub')
    .addAlias('/sub-bl', { options: { type: 'blscore' } })
    .addAlias('/sub-bs', { options: { type: 'bsmap' } })
    .addAlias('/subg-bl', { options: { type: 'blscore-group' } })
    .addAlias('/subg-bs', { options: { type: 'bsmap-group' } })
    .addAlias('blsub', { options: { type: 'blscore' } })
    .addAlias('bssub', { options: { type: 'bsmap' } })
    .addAlias('subbl', { options: { type: 'blscore' } })
    .addAlias('subbs', { options: { type: 'bsmap' } })
    .addAlias('subbsg', { options: { type: 'bsmap-group' } })
    .addAlias('subblg', { options: { type: 'blscore-group' } })
    .addOption('t', 'type:string')
    .setDescription('subscribe platform event')
    .setExecutor(async (c) => {
      const t = c.options.t
      if(t && !supportTypes.includes(t)) {
        throw new InvalidParamsError({
          name: "type",
          expect: supportTypes.toString(),
          actual: t
        })
      }
      if(idTypes.includes(t)) {
        return subscribeId(c)
      }
      if(groupTypes.includes(t)) {
        return subscribeGroup(c)
      }
      return showSubscriptions(c)
    })
