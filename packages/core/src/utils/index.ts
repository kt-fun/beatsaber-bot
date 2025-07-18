export const sleep = async (millsec: number = 5000) => {
  await new Promise<void>((resolve, reject) => {
    setTimeout(resolve, millsec)
  })
}

const diffMap = {
  E: 'Easy',
  N: 'Normal',
  H: 'Hard',
  EX: 'Expert',
  EP: 'ExpertPlus',
  'EX+': 'ExpertPlus',
}

export const convertDiff = (diff: string | null) => {
  if (!diff) {
    return diff
  }
  return diffMap[diff.toUpperCase()]
}

export * from './platform'
export * from './bsorDecoder'
