export * from './format'
export * from './tag-format'

export const diffConv = (diff: string) => {
  if (diff.includes('ExpertPlus')) {
    return 'EX+'
  } else if (diff.includes('Expert')) {
    return 'EX'
  } else if (diff.includes('Hard')) {
    return 'H'
  } else if (diff.includes('Normal')) {
    return 'N'
  }
  return 'E'
}
