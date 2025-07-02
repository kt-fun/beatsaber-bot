import { SSScore } from '@/service/api/interfaces/scoresaber/item'

export interface ScoresaberLeaderboardResp {
  scores: SSScore[]
  metadata: Metadata
}

export interface Metadata {
  total: number
  page: number
  itemsPerPage: number
}
