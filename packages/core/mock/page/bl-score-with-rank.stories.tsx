import BLRankScore from '@/components/pages/bl-score-with-rank'

import { bsmap } from '../bsmap'
import { bsor } from '../bsor'
import { blGlobalScores } from '../bl-global-score'
import { blScoreStatistic } from '../bl-score-statistic'
import {blScoreDetail} from "../bl-score";

export default {
  title: 'Page/BLRankScore', // 在Storybook侧边栏中的路径
  component: BLRankScore,
  tags: ['autodocs'], // 启用自动文档生成
  // argTypes 用来配置Controls面板的行为
  argTypes: {
    backgroundColor: { control: 'color' }, // 提供一个颜色选择器
  },
};
export const BLScoreStory = {
  args: {
    score:blScoreDetail,
    aroundScores: blGlobalScores,
    regionTopScores: blGlobalScores,
    difficulties: [],
    statistic: blScoreStatistic,
    bsor: bsor,
    bsMap: bsmap,
    bg: 'https://loliapi.com/acg/pe',
  },
}
