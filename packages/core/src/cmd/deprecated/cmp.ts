import { CommandBuilder } from '@/cmd/builder'

export default () =>
  new CommandBuilder()
    .setName('cmp') // <mapId:string>
    .addAlias('bbcmp')
    // .shortcut(/(^[0-9a-fA-F]{3,5}$)/, { args: ['$1'] })
    .setDescription('clear an auth account relate info')
    .setExecutor(async (c) => {
      // 1. @someone
      // 2. mapId/Hash
      // 3. me
      c.session.send('still working on')
    })
