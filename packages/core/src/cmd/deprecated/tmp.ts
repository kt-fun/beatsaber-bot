import {CommandBuilder} from "@/interface";

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
            c.session.sendQueued(c.session.text('commands.bsbot.lbrank.render.rank-start'))
          },
        }),
        c.services.render.renderUrl('https://aiobs.ktlab.io/tmp/lb/score', {
          selector: '#render-result',
          onRenderStart: () => {
            c.session.sendQueued(c.session.text('commands.bsbot.lbrank.render.score-start'))
          }
        }),
      ])
      await c.session.sendImgBuffer(hit, 'image/png')
      await c.session.sendImgBuffer(score, 'image/png')
    })
