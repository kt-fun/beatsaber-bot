import { CommandBuilder } from '@/cmd/builder'

export default () =>
  new CommandBuilder()
    .setName('lb')
    .addAlias('/lb')

    .setDescription('clear an auth account relate info')
    .addAlias('bblb')
    .addAlias('乐团新赛季')
    .setExecutor(async (c) => {
      const [hit, score] = await Promise.all([
        c.render.renderUrl('https://aiobs.ktlab.io/tmp/lb/hitcnt', () => {
          c.session.sendQueued('开始渲染砍击榜了，请耐心等待 10s')
        }),
        c.render.renderUrl('https://aiobs.ktlab.io/tmp/lb/score', () => {
          c.session.sendQueued('开始渲染分数榜了，请耐心等待 10s')
        }),
      ])
      c.session.sendImgBuffer(hit, 'image/png')
      c.session.sendImgBuffer(score, 'image/png')
    })
