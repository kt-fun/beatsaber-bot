import React from 'react'
import BSMapShare from './bs-map'
import SSPlayerPage from './ss-player'
import BLPlayerPage from './bl-player'
import { BLScore } from './bl-score'

import { BSMap } from '@/services/api/interfaces/beatsaver'
import { BeatLeaderUser, Score } from '@/services/api/interfaces/beatleader'
import { ScoreSaberItem, ScoreSaberUser } from '@/services/api/interfaces/scoresaber'
import BLRankScore from '@/components/pages/bl-score-with-rank'

export const BSMapComp = (
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
export const SSPlayerComp = (
  scores: ScoreSaberItem[],
  userInfo: ScoreSaberUser,
  bg: string
) => {
  return <SSPlayerPage scoreUser={userInfo} leaderItems={scores} bg={bg} />
}

export const BLPlayerComp = (
  scores: Score[],
  userInfo: BeatLeaderUser,
  bg: string
) => {
  return <BLPlayerPage user={userInfo} beatleaderItems={scores} bg={bg} />
}

export const BLScoreComp = (
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

export const BLRankScoreComp = (
  score,
  aroundScores,
  regionTopScores,
  difficulties,
  bsMap,
  statistic,
  bsor,
  bg
) => {
  return (
    <BLRankScore
      score={score}
      bsMap={bsMap}
      aroundScores={aroundScores}
      regionTopScores={regionTopScores}
      difficulties={difficulties}
      statistic={statistic}
      bsor={bsor}
      bg={bg}
    />
  )
}
