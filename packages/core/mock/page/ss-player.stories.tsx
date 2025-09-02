import SSPlayerPage from '@/components/pages/ss-player'
import { ssScores } from '../ss-score'
import { ssUser } from '../ss-user'

export default {
  title: 'Page/SSPlayerPage', // 在Storybook侧边栏中的路径
  component: SSPlayerPage,
  tags: ['autodocs'], // 启用自动文档生成
  // argTypes 用来配置Controls面板的行为
  argTypes: {
    backgroundColor: { control: 'color' }, // 提供一个颜色选择器
  },
}

export const SSPlayerPageStory = {
  args: {
    leaderItems: ssScores,
    scoreUser: ssUser,
    bg: 'https://loliapi.com/acg/pc',
  },
}
