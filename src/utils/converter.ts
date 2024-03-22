const diffMap =  {
  "E":"Easy",
  "N":"Normal",
  "H":"Hard",
  "EX":"Expert",
  "EP":"ExpertPlus",
  "EX+":"ExpertPlus",
}

export const convertDiff = (diff: string|null) => {
  if (!diff) {
    return diff
  }
  return diffMap[diff.toUpperCase()]
}
