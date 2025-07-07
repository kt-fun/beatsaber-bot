import {interpolate} from "./parser";
import {interpolateString} from "./util";

const defaultLang = "zh-CN";

export const createTranslator = (translateObject: object) => {
  return (path: string, params = {}, lang = defaultLang) => _translate(translateObject, path, params, lang)
}
const _translate = (
  translateObject: object,
  path: string,
  params = {},
  lang = defaultLang
) => {

  console.log("translate", path, params, lang)
  const keys = path.split('.')
  let result = translateObject[lang]
  if(!result) {
    return null
  }
  for (const key of keys) {
    if (result[key] !== undefined) {
      result = result[key]
    } else {
      return null
    }
  }
  try {
    if (typeof result === 'string') {
      return interpolate(result, params)
    }
  } catch (e) {
    return interpolateString(result, params)
  }
  return null
}
