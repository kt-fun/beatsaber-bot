import { CommandBuilder } from '@/cmd/builder'
import { getPreferenceSchemaByKeyOrName } from '@/utils'
import { EmptyPromptError, NotImplementedError } from '@/errors'

// user::key-schema
const httpRegex = /^https?:\/\/.+/
export default () =>
  new CommandBuilder()
    .setName('config')
    .addOption('s', 'platform:string')
    .addOption('v', 'value:string')
    .addAlias('bbconfig')
    .addAlias('bbget')
    .addAlias('bbset')
    .setExecutor(async (c) => {
      if (!c.input) {
        // const entries = await c.userPreference.configEntries()
        await c.session.sendQuote(
          c.session.text('commands.bsbot.config.show.not-implemented')
        )
        await c.session.sendQuote(
          c.session.text(`commands.bsbot.config.all-available-key`)
        )
        return
      }

      const key = getPreferenceSchemaByKeyOrName(c.input)
      if (!key) {
        c.session.send(
          c.session.text(`commands.bsbot.config.unknown-key`, {
            input: c.input,
          })
        )
        c.session.sendQuote(
          c.session.text(`commands.bsbot.config.all-available-key`)
        )
        return
      }
      await c.session.sendQuote(
        c.session.text(`commands.bsbot.config.prompt`, {
          type: key.valueType === 'img-url' ? '图片' : '字符串',
        })
      )
      const prompt = await c.session.prompt(30 * 1000)
      if (!prompt) {
        throw new EmptyPromptError()
      }
      switch (key.valueType) {
        case 'img-url':
          if (httpRegex.test(prompt)) {
            const f = await c.s3?.uploadImgWithUrl(prompt)
            if (f) {
              await c.userPreference.set(key.key, f)
              await c.session.sendQuote(
                c.session.text(`commands.bsbot.config.set.success`, {
                  key: key.i18nName,
                })
              )
              await c.session.sendImgByUrl(f)
              return
            }
          } else if (prompt.trim() == 'default') {
            await c.userPreference.set(key.key, key.default)
            await c.session.send(
              c.session.text(`commands.bsbot.config.set.success`, {
                key: key.i18nName,
              })
            )
          }
          c.session.text(`commands.bsbot.config.set.fail`, {
            key: key.key,
            reason: '我需要一张图片',
          })
          return
        case 'string':
          await c.userPreference.set(key.key, prompt)
          await c.session.send(
            c.session.text(`commands.bsbot.config.set.success`)
          )
          break
        case 'boolean':
        case 'number':
          throw new NotImplementedError()
      }
    })
