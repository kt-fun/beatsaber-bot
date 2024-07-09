import { Score } from './score'

export interface BeatLeaderPlayerScoreRequest {
  diff: string
  mode: string
  hash: string
  playerID: string
  leaderboardContext: string
}

export interface Metadata {
  itemsPerPage: number
  page: number
  total: number
  [property: string]: any
}

export interface BeadLeaderScoresResponse {
  data: Score[]
  metadata: Metadata
  [property: string]: any
}
