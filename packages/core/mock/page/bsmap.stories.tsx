import BSMap from '@/components/pages/bs-map'
import { bsmap } from '../bsmap'
import { bsMapQrUrl, previewQrUrl } from '../qr'
export default {
  title: 'Page/BSMap', // 在Storybook侧边栏中的路径
  component: BSMap,
  tags: ['autodocs'], // 启用自动文档生成
  // argTypes 用来配置Controls面板的行为
  argTypes: {
    backgroundColor: { control: 'color' }, // 提供一个颜色选择器
  },
}

export const BSMapStory = {
  args: {
    bsMap: bsmap,
    bsMapQrUrl: bsMapQrUrl,
    previewQrUrl: previewQrUrl,
  },
}
