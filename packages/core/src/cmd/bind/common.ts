import { CmdContext, Account } from '@/interface'
import {
  AccountNotFoundError,
  SessionPromotionCancelError,
  SessionPromotionTimeoutError,
} from '@/services/errors'
import {typeid} from "typeid-js";
export interface PlatformBindingServices {
  inputChecker?: (input: string) => void,
  fetchUser(id: string): Promise<{ id: string; name: string }>
  getExistingAccount(userId: string): Promise<Account | null>
  platformName: string
  providerId: 'beatleader' | 'beatsaver' | 'scoresaber'
}

export const handleIdBinding = async (
  c: CmdContext,
  services: PlatformBindingServices
) => {
  services.inputChecker?.(c.input)
  const player = await services.fetchUser(c.input)
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

  const prompt = (await c.session.prompt(c.config.promptTimeout))?.toLowerCase()
  if (!['yes', 'y'].includes(prompt)) {
    throw prompt
      ? new SessionPromotionCancelError()
      : new SessionPromotionTimeoutError()
  }

  const account: Partial<Account> = {
    id: existingAccount?.id ?? typeid().toString(),
    userId: c.session.user.id,
    providerId: services.providerId,
    accountId: player.id.toString(),
    providerUsername: player.name,
    metadata: {},
    updatedAt: now,
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
