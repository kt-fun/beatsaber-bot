import {CommandBuilder} from "@/interface/cmd/builder";

export default () =>
  new CommandBuilder()
    .setName('lb')
    .addAlias('/lb')
    .addAlias('bblb')
    .addAlias('乐团新赛季')
    .addAlias('乐团榜单')
    .setExecutor(async (c) => {
      const [hit, score] = await Promise.all([
        c.services.render.renderUrl('https://aiobs.ktlab.io/tmp/lb/hitcnt', {
          selector: '#render-result',
          onRenderStart:() => {
            c.session.sendQueued('开始渲染砍击榜了，请耐心等待 10s')
          },
        }),
        c.services.render.renderUrl('https://aiobs.ktlab.io/tmp/lb/score', {
          selector: '#render-result',
          onRenderStart: () => {
            c.session.sendQueued('开始渲染分数榜了，请耐心等待 10s')
          }
        }),
      ])
      c.session.sendImgBuffer(hit, 'image/png')
      c.session.sendImgBuffer(score, 'image/png')
    })
