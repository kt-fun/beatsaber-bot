import React from 'react'
import BSMapShare from './bs-map'
import SSPlayerPage from './ss-player'
import BLPlayerPage from './bl-player'
import { BLScore } from './bl-score'
import { BSMap } from '@/api/interfaces/beatsaver'
import { BeatLeaderUser, Score } from '@/api/interfaces/beatleader'
import { ScoreSaberItem, ScoreSaberUser } from '@/api/interfaces/scoresaber'

export const getBSMapComp = (
  bsMap: BSMap,
  bsMapQrUrl: string,
  previewQrUrl: string
) => {
  return (
    <BSMapShare
      bsMap={bsMap}
      bsMapQrUrl={bsMapQrUrl}
      previewQrUrl={previewQrUrl}
    />
  )
}
export const getSSPlayerComp = (
  scores: ScoreSaberItem[],
  userInfo: ScoreSaberUser
) => {
  return <SSPlayerPage scoreUser={userInfo} leaderItems={scores} />
}

export const getBLPlayerComp = (scores: Score[], userInfo: BeatLeaderUser) => {
  return <BLPlayerPage user={userInfo} beatleaderItems={scores} />
}

export const getBLScoreComp = (
  score: Score,
  bsMap: BSMap,
  statistic: any,
  bsor: any,
  qrcodeUrl: string
) => {
  return (
    <BLScore
      score={score}
      bsMap={bsMap}
      statistic={statistic}
      bsor={bsor}
      qrcodeUrl={qrcodeUrl}
    />
  )
}
