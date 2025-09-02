import type { StorybookConfig } from '@storybook/react-vite';
import { join } from 'path';
const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../mock/**/*.mdx",
    "../mock/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding",
    "@storybook/addon-a11y"
  ],
  "framework": {
    "name": "@storybook/react-vite",
    "options": {}
  },
  async viteFinal(config) {
    // 合并并自定义 Vite 配置
    const p = join(__dirname, './napi-canvas.mock.js')
    console.log("p", p)
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      '@napi-rs/canvas': p,
    };

    return config;
  },
};
export default config;
