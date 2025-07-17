import { CmdContext } from '@/interface'
import { InvalidParamsError } from '@/services/errors'
import { subById } from "./common";

const mapperIdRegex = /^\d+$/
export const subscribeBSMap = async (c: CmdContext) => {
  if (!mapperIdRegex.test(c.input)) {
    throw new InvalidParamsError({ name: "mapperId", expect: '/^\\d+$/', actual: c.input })
  }
  const type = 'bsmap'
  const data = await c.services.api.BeatSaver.getBSMapperById(c.input)
  const id = `${type}::${c.session.channel.id}::${data.id}`
  const extraData = { mapperId: data.id, mapperName: data.name }
  return subById(c, id, type, extraData);
}
