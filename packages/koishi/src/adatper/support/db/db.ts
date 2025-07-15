import {
  Account,
  Channel,
  DB,
  SubDetailWithGroupRes,
  SubInfoRes,
  Subscription,
  SubscriptionMember,
  SubWithGroupRes,
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
  async getUserAccountsByUid(uid: string) {
    const accounts = await this.db.get('BSRelateAccount', (row) => {
      return $.and(
        $.eq(row.userId, uid),
        $.or(
          $.eq(row.providerId, 'scoresaber'),
          $.eq(row.providerId, 'beatleader'),
          $.eq(row.providerId, 'beatsaver')
        )
      )
    })
    const blAccount = accounts.find((it) => it.providerId == 'beatleader')
    const ssAccount = accounts.find((it) => it.providerId == 'scoresaber')
    const bsAccount = accounts.find((it) => it.providerId == 'beatsaver')
    return {
      blAccount: blAccount,
      ssAccount,
      bsAccount,
    }
  }

  async getSubscriptionInfoByUGID(
    gid: string,
    uid: string
  ): Promise<SubInfoRes[]> {
    const rows = await this.db
      .join(
        ['BSSubscription', 'BSSubscriptionMember'],
        (s, m) => $.and($.eq(s.id, m.subscriptionId)),
        [false, true]
      )
      .where((r) => {
        return $.eq(r.BSSubscription.channelId, gid)
      })
      .groupBy(['BSSubscription.id'], {
        subscription: (row) => row.BSSubscription,
        memberCount: (row) => $.count(row.BSSubscriptionMember.memberId),
        me: (row) => $.in(uid, $.array(row.BSSubscriptionMember.memberId)),
      })
      .execute()
    return rows
  }

  async getSubscriptionsByGID(gid: string): Promise<Record<string, Subscription>> {
    const res = await this.db.get('BSSubscription', {
      channelId: gid,
    })
    const blSub = res.find((it) => it.type == 'beatleader-score')
    const bsMapSub = res.find((it) => it.type == 'beatsaver-map')
    const bsAlertSub = res.find((it) => it.type == 'beatsaver-alert')
    return {
      blSub,
      bsMapSub,
      bsAlertSub,
    }
  }
  async upsertSubscription(data: Partial<Subscription>): Promise<void> {
    await this.db.upsert('BSSubscription', [data])
  }
  async addSubscribeMember(data: Partial<SubscriptionMember>): Promise<void> {
    await this.db.upsert('BSSubscriptionMember', [data])
  }

  async addUserBindingInfo(account: Partial<Account>): Promise<void> {
    const [target] = await this.db.select('BSRelateAccount', (row) => $.and(
      $.eq(row.accountId, account.accountId),
      $.eq(row.providerId, account.providerId),
    )).execute()
    // account has been bind by other user
    if(target && target.userId !== account.userId) {
      throw new Error(`account ${account.providerId}:${account.accountId} has been bind by other user ${target.userId}`)
    }
    // account has been bind by this user
    if(target) {
      return
    }
    // not bound, create
    await this.db.create('BSRelateAccount', {
      id: typeid().toString(),
      ...account,
    })
  }


  async removeFromSubGroupBySubAndUid(
    subId: string,
    id: string
  ): Promise<void> {
    await this.db.remove('BSSubscriptionMember', {
      subscriptionId: subId,
      memberId: id,
    })
  }

  async getIDSubscriptionByGID(gid: string) {
    const res = await this.db
      .select('BSSubscription')
      .where((q) =>
        $.and(
          $.eq(q.channelId, gid),
          $.or(
            $.eq(q.type, 'id-beatsaver-map'),
            $.eq(q.type, 'id-beatleader-score')
          )
        )
      )
      .execute()
    return res
  }

  async removeIDSubscriptionByID(id: string): Promise<void> {
    await this.db.remove('BSSubscription', { id })
  }
  async getIDSubscriptionByType(
    type: string
  ): Promise<SubWithGroupRes[]> {
    const res = await this.db
      .join(
        {
          subscription: this.db
            .select('BSSubscription')
            .where((r) => $.eq(r.type, type)),
          channel: this.db.select('BSChannel'),
        },
        ({ subscription, channel }) =>
          $.and($.eq(subscription.channelId, channel.id))
      )
      .execute()
    return res.map(it => ({
      subscription: it.subscription,
      channel: it.channel
    }))
  }
  async getIDSubscriptionByChannelIDAndType(
    gid: string,
    type: string
  ): Promise<Subscription[]> {
    const res = await this.db
      .select('BSSubscription')
      .where((q) => $.and($.eq(q.channelId, gid), $.eq(q.type, type)))
      .execute()
    return res
  }
  async getAllSubscriptionByUIDAndPlatform(
    id: string,
    platform: string
  ): Promise<SubDetailWithGroupRes[]> {
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
            .where((r) => $.eq(r.enabled, true)),
          BSChannel: this.db
            .select('BSChannel'),
        },
        ({
          BSRelateAccount,
          BSUser,
          BSSubscriptionMember,
          BSSubscription,
          BSChannel,
        }) =>
          $.and(
            $.eq(BSRelateAccount.userId, BSUser.id),
            $.eq(BSRelateAccount.userId, BSSubscriptionMember.memberId),
            $.eq(BSSubscription.id, BSSubscriptionMember.subscriptionId),
            $.eq(BSChannel.id, BSSubscription.channelId)
          )
      )
      .execute()
    return subs.map((sub) => ({
      account: sub.BSRelateAccount,
      user: sub.BSUser,
      subscriptionMember: sub.BSSubscriptionMember,
      subscription: sub.BSSubscription,
      channel: sub.BSChannel,
    }))
  }

  async getSubscriptionsByType(type: string) {
    const subs = await this.db
      .join(
        {
          BSSubscription: this.db
            .select('BSSubscription')
            .where((r) => $.and($.eq(r.enabled, true), $.eq(r.type, type))),
          BSChannel: this.db
            .select('BSChannel')
        },
        ({ BSSubscription, BSChannel }) =>
          $.and($.eq(BSChannel.id, BSSubscription.channelId))
      )
      .execute()
    const res = subs.map((sub) => ({
      // account: sub.BSRelateAccount,
      subscription: sub.BSSubscription,
      channel: sub.BSChannel,
    }))
    return res
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
