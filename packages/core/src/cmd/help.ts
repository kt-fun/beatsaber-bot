import { CommandBuilder } from '@/cmd/builder'

export default () =>
  new CommandBuilder()
    .setName('help')
    .addAlias('/help')
    .addAlias('bbhelp')
    .addAlias('!help')
    .setDescription('clear an auth account relate info')
    .setExecutor(async (c) => {
      await c.session.sendImgUrl(
        'https://tmp-r2.ktlab.io/bsbot.basic.v0.1.0.png'
      )
      await c.session.sendImgUrl('https://tmp-r2.ktlab.io/bsbot.sub.v0.1.0.png')
    })
