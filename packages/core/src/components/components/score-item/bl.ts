import {Score} from "@/services/api/interfaces/beatleader";
import {diffConv, formatRelativeTimeByDay} from "@/components/utils";

const getModifiers = (modifiers: string) => {
  return modifiers ? modifiers.split(',') : []
}

export const getScorePropsByBLScore = (item: Score) => {
  const name = item.leaderboard.song.name
  const cover = item.leaderboard.song.coverImage
  const difficulty = diffConv(item.leaderboard.difficulty.difficultyName)
  const star = item.leaderboard.difficulty.stars?.toFixed(2) ?? 'none'
  const mapId = item.leaderboard.song.id.toLowerCase().replaceAll('x', '')
  const acc = ((item.baseScore / item.leaderboard.difficulty.maxScore) * 100).toFixed(2) + "%"
  const pp = `${item.pp.toFixed(2)}PP`
  const relativeTime = formatRelativeTimeByDay(item.timepost * 1000)
  const modifiers = getModifiers(item.modifiers)
  const badges: string[] = []
  if(item.fullCombo) {
    badges.push('fc')
  }
  // @ts-ignore
  if(item?.metadata?.pinnedContexts) {
    badges.push('pinned')
  }
  return {
    name,
    cover,
    difficulty,
    star,
    mapId,
    acc,
    pp,
    relativeTime,
    modifiers,
    badges
  }
}
