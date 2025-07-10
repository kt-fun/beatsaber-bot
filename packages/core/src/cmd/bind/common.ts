import { CmdContext, Account } from '@/interface'
import {
  SessionPromotionCancelError,
  SessionPromotionTimeoutError,
} from '@/services/errors'

export interface PlatformBindingServices {
  fetchUser(id: string): Promise<{ id: string; name: string } | null>
  getExistingAccount(userId: string): Promise<Account | null>
  platformName: string
  providerId: 'beatleader' | 'beatsaver' | 'scoresaber'
}

export const handleIdBinding = async (
  c: CmdContext,
  services: PlatformBindingServices
) => {
  const player = await services.fetchUser(c.input)
  if (!player) {
    throw new Error(`commands.bsbot.${services.platformName}.account.not-found`)
  }

  const now = new Date()
  const existingAccount = await services.getExistingAccount(c.session.user.id)

  const text =
    c.session.text('commands.bsbot.bind.ack-prompt', {
      user: `${player.name}(${player.id})`,
    }) +
    (existingAccount
      ? ',' +
        c.session.text('commands.bsbot.bind.exist', {
          id: existingAccount.accountId,
        })
      : '')

  await c.session.sendQuote(text)

  const prompt = await c.session.prompt(c.config.promptTimeout)
  if (!prompt || (prompt.toLowerCase() !== 'y' && prompt.toLowerCase() !== 'yes')) {
    throw prompt
      ? new SessionPromotionCancelError()
      : new SessionPromotionTimeoutError()
  }

  const account: Partial<Account> = {
    userId: c.session.user.id,
    providerId: services.providerId,
    accountId: player.id.toString(),
    providerUsername: player.name,
    metadata: {},
    lastModifiedAt: now,
    lastRefreshAt: now,
    createdAt: now,
    type: 'id',
  }

  await c.services.db.addUserBindingInfo(account)
  await c.session.sendQuote(
    c.session.text(`commands.bsbot.bind.${services.platformName}.success`, {
      name: player.name,
      id: player.id,
    })
  )
}
