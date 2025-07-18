import {CommandBuilder} from "@/interface";

export const Tmp = new CommandBuilder()
    .setName('lb')
    .addAlias('/lb')
    .addAlias('bblb')
    .addAlias('乐团新赛季')
    .addAlias('乐团榜单')
    .setExecutor(async (c) => {
      await Promise.all([
        c.services.render.renderUrl('https://aiobs.ktlab.io/tmp/lb/hitcnt', {
          selector: '#render-result',
          onRenderStart:() => {
            c.session.sendQueued(c.session.text('commands.bsbot.lbrank.render.hitcnt-start'))
          },
        }).then(hit => c.session.sendImgBuffer(hit, 'image/png')),

        c.services.render.renderUrl('https://aiobs.ktlab.io/tmp/lb/score', {
          selector: '#render-result',
          onRenderStart: () => {
            c.session.sendQueued(c.session.text('commands.bsbot.lbrank.render.score-start'))
          }
        }).then(score => c.session.sendImgBuffer(score, 'image/png')),
      ])
    })
