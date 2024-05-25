import {BSMap} from "../../types";

export const getMods = (bsMap: BSMap) => {
  let res:string[] = []
  let publishedVersion = bsMap.versions[0]
  if(publishedVersion.diffs.some(it=> it.chroma)) {
    res.push("Chroma")
  }
  if(publishedVersion.diffs.some(it=> it.cinema)) {
    res.push("Cinema")
  }
  if(publishedVersion.diffs.some(it=> it.me)) {
    res.push("Mapping")
  }
  if(publishedVersion.diffs.some(it=> it.ne)) {
    res.push("Noodle")
  }
  return res
}
