import {interpolate} from "./parser";
import {interpolateString} from "./util";

const defaultLang = "zh-CN";

export const createTranslator = (translateObject: object) => {
  return (path: string, params = {}, lang = defaultLang) => translate(translateObject, path, params, lang)
}

export const translate = (
  translateObject: object,
  path: string,
  params = {},
  lang = defaultLang
) => {
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
