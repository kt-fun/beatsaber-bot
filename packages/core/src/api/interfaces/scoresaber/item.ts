export interface ScoreSaberItem {
  score: BeatScore
  leaderboard: LeaderBoard
  mapId?: string
}

interface BeatScore {
  id: number
  leaderboardPlayerInfo: any
  rank: number
  baseScore: number
  modifiedScore: number
  pp: number
  weight: number
  modifiers: string
  multiplier: number
  badCuts: number
  missedNotes: number
  maxCombo: number
  fullCombo: boolean
  hmd: number
  timeSet: string
  hasReplay: boolean
  deviceHmd: string
  deviceControllerLeft: string
  deviceControllerRight: string
}

interface LeaderBoard {
  id: number
  songHash: string
  songName: string
  songSubName: string
  songAuthorName: string
  levelAuthorName: string
  difficulty: {
    leaderboardId: number
    difficulty: number
    gameMode: string
    difficultyRaw: string
  }
  maxScore: number
  createdDate: string
  rankedDate: string
  qualifiedDate: string
  lovedDate: any
  ranked: boolean
  qualified: boolean
  loved: boolean
  maxPP: number
  stars: number
  plays: number
  dailyPlays: number
  positiveModifiers: boolean
  playerScore: any
  coverImage: string
  difficulties: any
}
