export interface ScoreSaberItem {
  score: SSScore
  leaderboard: LeaderBoard
  mapId?: string
}

export interface SSScore {
  id: number
  leaderboardPlayerInfo: LeaderboardPlayerInfo
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

export interface LeaderboardPlayerInfo {
  id: string
  name: string
  profilePicture: string
  country: string
  permissions: number
  badges?: string
  role?: string
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
