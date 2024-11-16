// @ts-ignore
import BLRankScore from '../../src/img-render/result/bl-score-with-rank'

import { bsmap } from '../bsmap'
import { bsor } from '../bsor'
import { blGlobalScores } from '../bl-global-score'
import { blScoreStatistic } from '../bl-score-statistic'

export default {
  component: BLRankScore,
}
export const BLScoreStory = {
  args: {
    score: blGlobalScores[0],
    aroundScores: blGlobalScores,
    regionTopScores: blGlobalScores,
    difficulties: [],
    statistic: blScoreStatistic,
    bsor: bsor,
    bsMap: bsmap,
    bg: 'https://loliapi.com/acg/pe',
  },
}
