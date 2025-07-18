import {
  Account,
  AddSubscriptionMember,
  Channel,
  DB,
  EventTarget,
  mergeEventTargets,
  SubInfoRes,
  Subscription,
  User
} from 'beatsaber-bot-core'
import {$, Context, Database, Tables} from 'koishi'
import {ChannelInfo} from './type'
import {typeid} from "typeid-js";

export class KoishiDB implements DB {
  db: Database<Tables>

  constructor(ctx: Context) {
    // @ts-ignore
    this.db = ctx.database
  }


  // preference
  async storeUserPreference<V = any>(
    uid: string,
    // gid: number | undefined,
    value: V
  ): Promise<boolean> {
    const res = await this.db.upsert('BSUserPreference', [
      {
        userId: uid,
        channelId: "0",
        data: value ?? {},
      },
    ])
    return res.inserted == 1
  }
  async getUserPreference<V = any>(
    uid: string
    // gid: number | undefined,
  ): Promise<V> {
    const res = await this.db.get('BSUserPreference', (row) =>
      // $.and($.eq(row.uid, uid), $.eq(row.gid, gid))
      $.eq(row.userId, uid)
    )
    return res?.[0]?.data ?? {}
  }
  // accounts

  async getUserAccountsByUserIdAndType<T extends readonly string[] = string[]>(id: string, types: T): Promise<Record<T[number], Account>> {
    const accounts = await this.db.get('BSRelateAccount', (row) => {
      return $.and(
        $.eq(row.userId, id),
        // todo use array in
        $.or(...types.map(it => $.eq(row.providerId, it)))
      )
    })
    const res = types.reduce((acc, cur) => {
      acc[cur] = accounts.find(it => it.providerId === cur)
      return acc
    }, {} as Record<T[number], Account>)
    return res
  }
  async getUserAccountsByUserId(id: string): Promise<Account[]> {
    const accounts = await this.db.get('BSRelateAccount', (row) => {
      return $.and(
        $.eq(row.userId, id),
        $.or(
          $.eq(row.providerId, 'scoresaber'),
          $.eq(row.providerId, 'beatleader'),
          $.eq(row.providerId, 'beatsaver')
        )
      )
    })
    return accounts
  }
  async addUserAccount(account: Partial<Account>): Promise<void> {
    const [target] = await this.db.select('BSRelateAccount', (row) => $.and(
      $.eq(row.accountId, account.accountId),
      $.eq(row.providerId, account.providerId),
    )).execute()
    await this.db.create('BSRelateAccount', {
      id: typeid().toString(),
      ...account,
    })
  }


  // subscription member
  async addSubscriptionMember(data: AddSubscriptionMember): Promise<void> {
    await this.db.upsert('BSSubscriptionMember', [data])
  }

  async removeSubscriptionMemberBySubIdAndMemberId(subId: string, id: string): Promise<void> {
    await this.db.remove('BSSubscriptionMember', {
      subscriptionId: subId,
      memberId: id,
    })
  }


  // get subscription
  async getSubscriptionByID(id: string): Promise<Subscription | null> {
    const res = await this.db
      .select('BSSubscription')
      .where((q) => $.eq(q.id, id))
      .execute()
    return res[0] ?? null
  }

  async getGroupSubscriptionByChannelIDAndType(channelId: string, type: string): Promise<Subscription | null> {
    const res = await this.db
      .select('BSSubscription')
      .where((q) => $.and(
        $.eq(q.channelId, channelId),
        $.eq(q.type, type)
      ))
      .execute()
    return res[0] ?? null
  }

  async getSubscriptionByChannelIDAndType(gid: string, type: string): Promise<Subscription[]> {
    const res = await this.db
      .select('BSSubscription')
      .where((q) => $.and(
          $.eq(q.channelId, gid),
          $.eq(q.type, type),
      ))
      .execute()
    return res
  }


  // get subscription info
  async getSubscriptionInfoByUserAndChannelID(userId: string, channelId: string): Promise<SubInfoRes[]> {
    const rows = await this.db
      .join(
        ['BSSubscription', 'BSSubscriptionMember'],
        (s, m) => $.and($.eq(s.id, m.subscriptionId)),
        [false, true]
      )
      .where((r) => {
        return $.eq(r.BSSubscription.channelId, channelId)
      })
      .groupBy(['BSSubscription.id'], {
        subscription: (row) => row.BSSubscription,
        memberCount: (row) => $.count(row.BSSubscriptionMember.memberId),
        me: (row) => $.in(userId, $.array(row.BSSubscriptionMember.memberId)),
      })
      .execute()
    return rows
  }

  async getSubscriptionMemberByUserChannelAndType(userId: string, channelId: string, type: string): Promise<SubInfoRes | null> {
    const rows = await this.db
      .join(
        ['BSSubscription', 'BSSubscriptionMember'],
        (s, m) => $.and($.eq(s.id, m.subscriptionId)),
        [false, true]
      )
      .where((r) => {
        return $.and(
          $.eq(r.BSSubscription.channelId, channelId),
          $.eq(r.BSSubscription.type, type)
        )
      })
      .groupBy(['BSSubscription.id'], {
        subscription: (row) => row.BSSubscription,
        memberCount: (row) => $.count(row.BSSubscriptionMember.memberId),
        me: (row) => $.in(userId, $.array(row.BSSubscriptionMember.memberId)),
      })
      .execute()
    return rows[0] ?? null
  }


  // insert subscription
  async upsertSubscription(data: Partial<Subscription>): Promise<void> {
    await this.db.upsert('BSSubscription', [data])
  }
  // remove subscription
  async removeSubscriptionByID(id: string): Promise<void> {
    await this.db.remove('BSSubscription', { id })
  }

  private async getEventTargetsByPlatformAccount(platform: string, id: string, type: string, eventType: string): Promise<EventTarget[]> {
    const subs = await this.db
      .join(
        {
          BSRelateAccount: this.db
            .select('BSRelateAccount')
            .where((r) =>
              $.and(
                $.eq(r.providerId, platform),
                $.eq(r.accountId, id?.toString())
              )
            ),
          BSUser: this.db.select('BSUser'),
          BSSubscriptionMember: this.db.select('BSSubscriptionMember'),
          BSSubscription: this.db
            .select('BSSubscription')
            .where((r) => $.and(
              $.eq(r.enabled, true),
              $.eq(r.type, type),
              $.eq(r.eventType, eventType),
            )),
          BSChannel: this.db
            .select('BSChannel'),
          BSChannelAccount: this.db.select('BSRelateAccount')
        },
        ({
           BSRelateAccount,
           BSUser,
           BSSubscriptionMember,
           BSSubscription,
           BSChannel,
          BSChannelAccount
         }) =>
          $.and(
            $.eq(BSRelateAccount.userId, BSUser.id),
            $.eq(BSRelateAccount.userId, BSSubscriptionMember.memberId),
            $.eq(BSSubscription.id, BSSubscriptionMember.subscriptionId),
            $.eq(BSChannel.id, BSSubscription.channelId),
            $.eq(BSChannel.providerId, BSChannelAccount.providerId),
            $.eq(BSUser.id, BSChannelAccount.userId),
          )
      )
      .execute()
    const rows = subs.map((sub) => ({
      account: sub.BSRelateAccount,
      user: sub.BSUser,
      subscriptionMember: sub.BSSubscriptionMember,
      subscription: sub.BSSubscription,
      channel: sub.BSChannel,
      channelAccount: sub.BSChannelAccount
    }))
    const maps = rows.reduce((acc, cur) => {
      let m = acc.get(cur.channel.id)
      if(!m) {
        m = { channel: cur.channel, users: [], subscriptions: []}
      }
      if(cur.user) m.users.push({...cur.user, account: cur.account, channelAccount: cur.channelAccount })
      m.subscriptions.push(cur.subscription)
      acc.set(cur.channel.id, m)
      return acc
    }, new Map<string, EventTarget>())
    return Array.from(maps.values())
  }

  private async getCommonEventTargets(eventType: string, type: string,entityKey: string, entityId: string): Promise<EventTarget[]> {
    //todo verify json query method in dsl
    const subs = await this.db
      .select('BSSubscription')
      .join('BSChannel', this.db.select('BSChannel'), (s, c) => {
        return $.eq(s.channelId, c.id)
      }).where(r => $.and(
        $.eq(r.enabled, true),
        $.eq(r.type, type),
        $.eq(r.eventType, eventType),
      ))
      .execute()

    return subs
      .filter(it => it.data?.[entityKey] === entityId)
      .map(it => {
      const {BSChannel, ...sub} = it
      return {
        subscriptions: [sub],
        channel: BSChannel,
        users: []
      }
    })
  }
  async getBLScoreEventTargets(playerId: string): Promise<EventTarget[]> {
    const part1 = await this.getCommonEventTargets('blscore-update', 'blscore', 'playerId', playerId)
    const part2 = await this.getEventTargetsByPlatformAccount('beatleader', playerId, 'blscore-group', 'blscore-update')
    return mergeEventTargets(part1, part2)
  }
  async getBSMapEventTargets(mapperId: string): Promise<EventTarget[]> {
    const part1 = await this.getCommonEventTargets('bsmap-update', 'bsmap', 'mapperId', mapperId)
    const part2 = await this.getEventTargetsByPlatformAccount('beatsaver', mapperId, 'bsmap-group', 'bsmap-update')
    return mergeEventTargets(part1, part2)
  }

  async getScheduleEventTargets(type: string): Promise<EventTarget[]> {
    const subs = await this.db
      .select('BSSubscription')
      .join('BSChannel', this.db.select('BSChannel'), (s, c) => {
        return $.eq(s.channelId, c.id)
      }).where(r => $.and(
        $.eq(r.enabled, true),
        $.eq(r.type, type),
        $.eq(r.eventType, 'schedule'),
      ))
      .execute()
    return subs.map(it => {
      const {BSChannel, ...sub} = it
      return {
        subscriptions: [sub],
        channel: BSChannel,
        users: []
      }
    })
  }

  async getUAndGBySessionInfo(
    c: ChannelInfo
  ): Promise<{user: User, channel: Channel}> {
    let u: User, g: Channel
    await this.db.withTransaction(async (tx) => {
      const [res] = await this.db
        .join(
          {
            User: this.db
              .select('BSUser'),
            Account: this.db
              .select('BSRelateAccount')
              .where((r) => $.and(
                  $.eq(r.providerId, `koishi:${c.platform}`),
                  $.eq(r.accountId, c.uid),
                )
              ),
          },
          ({ User, Account }) => $.eq(User.id, Account.userId)
        ).execute()
      u = res?.User
      const now = new Date()
      if(!u) {
        u = await tx.create('BSUser', {
          id: typeid().toString(),
          name: c.uid,
          createdAt: now,
          updatedAt: now
        })
        const account = await tx.create('BSRelateAccount', {
          id: typeid().toString(),
          userId: u.id,
          providerId: `koishi:${c.platform}`,
          accountId: c.uid,
          createdAt: now,
          updatedAt: now
        })
      }
      const [channel] = await tx.get('BSChannel', (r) =>
        $.and(
          $.eq(r.channelId, c.channelId),
          $.eq(r.providerId, `koishi:${c.platform}`),
        )
      )
      g = channel
      if(!g) {
        g = await tx.create('BSChannel', {
          id: typeid().toString(),
          providerId: `koishi:${c.platform}`,
          channelId: c.channelId,
          createdAt: now,
          updatedAt: now,
        })
      }
    })
    return {user: u, channel: g}
  }

  async batchGetOrCreateUBySessionInfo(
    s: { uid: string, platform: string, selfId: string }[]
  ): Promise<User[]> {
    if(s.length == 0) return []
    const uids = s.map((s) => s.uid)
    const platform = s[0].platform
    const exists = await this.db.get('BSRelateAccount', (account) =>
      $.and(
        $.eq(account.providerId, `koishi:${platform}`),
        $.in(account.accountId, uids)
      )
    )

    const needCreate = s.filter(
      (session) => !exists.map((r) => r.accountId).includes(session.uid)
    )

    const now = new Date()
    const data = needCreate.map((it) => {
      const uid = typeid().toString()
      return {
        id: uid,
        name: '',
        createdAt: now,
        updatedAt: now,
        account: {
          id: typeid().toString(),
          userId: uid,
          providerId: `koishi:${it.platform}`,
          accountId: it.uid,
          createdAt: now,
          lastModifiedAt: now
        }
      }
    })

    const users = data.map(it => {
      const {account, ...user} = it
      return user
    })
    await this.db.withTransaction(async (tx) => {
      await tx.upsert('BSUser', users)
      await tx.upsert('BSRelateAccount', data.map(it => it.account))
    })
    const res = await this.db
      .join(
        {
          User: this.db
            .select('BSUser'),
          Account: this.db
            .select('BSRelateAccount')
            .where((r) => $.and(
                $.eq(r.type, 'user'),
                $.eq(r.providerId, `koishi:${platform}`),
                $.in(r.accountId, uids),
              )
            ),
        },
        ({ User, Account }) => $.eq(User.id, Account.userId)
      ).execute()
    return res.map(it => ({
      ...it.User,
      Account: it.Account
    }))
  }
}
