import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "koishi-plugin-beatsaber-bot",
  description: "a koishi bot plugin for bot",
  cleanUrls: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: '示例', link: '/example' },
      { text: '谱面指令', link: '/map' },
      { text: 'rank指令', link: '/rank' }
    ],

    sidebar: [

      { text: '示例', link: '/example' },
      { text: '谱面指令', link: '/map' },
      { text: 'rank指令', link: '/rank' }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ktkongtong/koishi-beats-bot' }
    ]
  }
})
