import { beatleaderScores } from '../bl-score'
import { blUser } from '../bl-user'
import BLPlayerPage from "@/components/pages/bl-player";


export default {
  title: 'Page/BLPlayerPage', // 在Storybook侧边栏中的路径
  component: BLPlayerPage,
  tags: ['autodocs'], // 启用自动文档生成
  // argTypes 用来配置Controls面板的行为
  argTypes: {
    backgroundColor: { control: 'color' }, // 提供一个颜色选择器
  },
};
export const BLPlayerPageStory = {
  args: {
    beatleaderItems: beatleaderScores,
    user: blUser,
    bg: 'https://loliapi.com/acg/pc',
  },
}
