import { ScoreSaberItem } from './item'

export interface ScoreSaberUserResponse {
  playerScores: ScoreSaberItem[]
  metadata: {
    total: number
    page: number
    itemsPerPage: number
  }
}
