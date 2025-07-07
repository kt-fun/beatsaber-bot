
export function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item)
}

export function merge(target, ...sources) {
  if (!sources.length) return target
  const source = sources.shift()
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} })
        merge(target[key], source[key])
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    }
  }
  return merge(target, ...sources)
}


export function interpolateString(str, context) {
  // 正则表达式匹配三元表达式
  const regex = /\{\{(.*?)\?\s*'(.*?)'\s*:\s*'(.*?)'\s*\}\}/
  let match

  // 递归解析
  while ((match = regex.exec(str)) !== null) {
    const [fullMatch, condition, trueValue, falseValue] = match

    // 递归解析 trueValue 和 falseValue 以处理嵌套情况
    const resolvedTrueValue = interpolateString(trueValue, context)
    const resolvedFalseValue = interpolateString(falseValue, context)

    // 计算条件表达式
    let result = safeEval(condition, context)
    if (typeof result === 'string') {
      result = false
    }
    const replacement = result ? resolvedTrueValue : resolvedFalseValue

    // 替换匹配到的三元表达式
    str = str.replace(fullMatch, replacement)
  }

  // 替换变量插值
  const variableRegex = /\{\{(.*?)\}\}/g
  str = str.replace(variableRegex, (match, expr) => safeEval(expr, context))

  return str
}
function safeEval(expr, context) {
  try {
    const fn = new Function(...Object.keys(context), `return ${expr}`)
    return fn(...Object.values(context))
  } catch (e) {
    console.error(expr, context, e)
    return expr
  }
}

