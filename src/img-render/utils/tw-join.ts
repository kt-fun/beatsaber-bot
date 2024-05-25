

export type ClassNameValue = ClassNameArray | string | null | undefined | 0 | 0n | false
type ClassNameArray = ClassNameValue[]

export function twJoin(...classLists: ClassNameValue[]) {
  let index = 0
  let argument: ClassNameValue
  let resolvedValue: string
  let string = ''

  while (index < arguments.length) {
    if ((argument = arguments[index++])) {
      if ((resolvedValue = toValue(argument))) {
        string && (string += ' ')
        string += resolvedValue
      }
    }
  }
  return string
}

function toValue(mix: ClassNameArray | string) {
  if (typeof mix === 'string') {
    return mix
  }

  let resolvedValue: string
  let string = ''

  for (let k = 0; k < mix.length; k++) {
    if (mix[k]) {
      if ((resolvedValue = toValue(mix[k] as ClassNameArray | string))) {
        string && (string += ' ')
        string += resolvedValue
      }
    }
  }

  return string
}
