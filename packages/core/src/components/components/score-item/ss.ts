import type {ScoreSaberItem} from "@/services/api/interfaces/scoresaber";
import {diffConv, formatRelativeTimeByDay} from "@/components/utils";

const getModifiers = (modifiers: string) => {
  return modifiers ? modifiers.split(',') : []
}

export const getScorePropsBySSScore = (item: ScoreSaberItem) => {
  const name = item.leaderboard.songName
  const cover = item.leaderboard.coverImage
  const difficulty = diffConv(item.leaderboard.difficulty.difficultyRaw)
  const star = item.leaderboard.stars?.toFixed(2) ?? 'none'
  const mapId = item.mapId
  const acc = (item.score.baseScore / item.leaderboard.maxScore).toFixed(2) + "%"
  const pp = `${item.score.pp.toFixed(2)}PP`
  const relativeTime = formatRelativeTimeByDay(item.score.timeSet)
  const modifiers = getModifiers(item.score.modifiers)
  const badges: string[] = []
  if (item.score.fullCombo) {
    badges.push('fc')
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
