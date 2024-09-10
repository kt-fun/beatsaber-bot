import {
  DB,
  RelateAccount,
  SubDetailWithGroupRes,
  SubInfoRes,
  Subscribe,
  SubscribeMember,
  SubWithGroupRes,
} from 'beatsaber-bot-core'
import { $, Context, Database, Tables } from 'koishi'
import { ChannelInfo, KoiRelateChannelInfo } from '@/types'

export class KoishiDB implements DB<ChannelInfo> {
  db: Database<Tables>

  constructor(ctx: Context) {
    // @ts-ignore
    this.db = ctx.database
  }

  async getUserAccountsByUid(uid: number) {
    const accounts = await this.db.get('BSRelateAccount', (row) => {
      return $.and(
        $.eq(row.uid, uid),
        $.or(
          $.eq(row.platform, 'scoresaber'),
          $.eq(row.platform, 'beatleader'),
          $.eq(row.platform, 'beatsaver')
        )
      )
    })
    const blAccount = accounts.find((it) => it.platform == 'beatleader')
    const ssAccount = accounts.find((it) => it.platform == 'scoresaber')
    const bsAccount = accounts.find((it) => it.platform == 'beatsaver')
    return {
      blAccount: blAccount,
      ssAccount,
      bsAccount,
    }
  }

  async getSubscriptionInfoByUGID(
    gid: number,
    uid: number
  ): Promise<SubInfoRes[]> {
    const rows = await this.db
      .join(
        ['BSSubscribe', 'BSSubscribeMember'],
        (s, m) => $.and($.eq(s.id, m.subscribeId), $.eq(s.gid, gid)),
        [false, true]
      )
      .groupBy(['BSSubscribe.id'], {
        subscribe: (row) => row.BSSubscribe,
        memberCount: (row) => $.count(row.BSSubscribeMember.memberUid),
        me: (row) => $.in(uid, $.array(row.BSSubscribeMember.memberUid)),
      })
      .execute()
    return rows
  }

  async getSubscriptionsByGID(gid: number): Promise<Record<string, Subscribe>> {
    const res = await this.db.get('BSSubscribe', {
      gid: gid,
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
  async upsertSubscription(data: Partial<Subscribe>): Promise<void> {
    await this.db.upsert('BSSubscribe', [data])
  }
  async addSubscribeMember(data: Partial<SubscribeMember>): Promise<void> {
    await this.db.upsert('BSSubscribeMember', [data])
  }

  async addUserBindingInfo(account: Partial<RelateAccount>): Promise<void> {
    await this.db.upsert('BSRelateAccount', [account])
  }

  async getUAndGBySessionInfo(
    s: ChannelInfo
  ): Promise<[KoiRelateChannelInfo, KoiRelateChannelInfo]> {
    let u: KoiRelateChannelInfo, g: KoiRelateChannelInfo
    await this.db.withTransaction(async (tx) => {
      while (!u) {
        const res = await tx.get('BSRelateChannelInfo', (r) =>
          $.and(
            $.eq(r.platform, s.platform),
            $.eq(r.uid, s.uid),
            $.eq(r.type, 'user')
          )
        )
        u = res[0]
        if (!u) {
          u = await tx.create('BSRelateChannelInfo', {
            type: 'user',
            platform: s.platform,
            uid: s.uid,
            selfId: s.selfId,
          })
        }
      }
      while (!g) {
        const res = await tx.get('BSRelateChannelInfo', (r) =>
          $.and(
            $.eq(r.platform, s.platform),
            $.eq(r.channelId, s.channelId),
            $.eq(r.type, 'group')
          )
        )
        g = res[0]
        if (!g) {
          g = await tx.create('BSRelateChannelInfo', {
            type: 'group',
            platform: s.platform,
            channelId: s.channelId,
            selfId: s.selfId,
          })
        }
      }
    })
    return [u, g]
  }

  async batchGetOrCreateUBySessionInfo(
    s: ChannelInfo[]
  ): Promise<KoiRelateChannelInfo[]> {
    const uids = s.map((s) => s.uid)
    const exists = await this.db.get('BSRelateChannelInfo', (c) =>
      $.and(
        // $.eq(c.refId, u.id),
        $.eq(c.type, 'user'),
        $.in(c.uid, uids)
      )
    )

    const needCreate = s.filter(
      (session) => !exists.map((r) => r.uid).includes(session.uid)
    )

    await this.db.withTransaction(async (tx) => {
      const data = needCreate.map((it) => ({
        type: 'user',
        platform: it.platform,
        uid: it.uid,
        selfId: it.selfId,
      }))
      await tx.upsert('BSRelateChannelInfo', data)
    })
    const all = await this.db.get('BSRelateChannelInfo', (c) =>
      $.and(
        // $.eq(c.refId, u.id),
        $.eq(c.type, 'user'),
        $.in(c.uid, uids)
      )
    )
    return all
  }

  async removeFromSubGroupBySubAndUid(
    subId: number,
    id: number
  ): Promise<void> {
    await this.db.remove('BSSubscribeMember', {
      subscribeId: subId,
      memberUid: id,
    })
  }

  async getAllSubScriptionByBSID(
    userId: number
  ): Promise<SubDetailWithGroupRes<ChannelInfo>[]> {
    const subs = await this.db
      .join(['BSRelateAccount', 'BSRelateChannelInfo'], (acc, c1) =>
        $.and(
          $.eq(acc.platformUid, userId.toString()),
          $.eq(acc.platform, 'beatsaver'),
          $.eq(acc.uid, c1.id),
          $.eq(c1.type, 'user')
          // $.eq(m.memberUid, acc.uid),
          // $.eq(m.subscribeId, s.id),
          // $.eq(s.enable, true),
          // $.eq(s.type, 'beatsaver-map'),
          // $.eq(s.gid, c2.id),
          // $.eq(c2.type, 'group')
        )
      )
      .join(
        'BSSubscribeMember',
        this.db.select('BSSubscribeMember'),
        // ['BSSubscribeMember', 'BSSubscribe', 'BSRelateChannelInfo'],
        (r, m) => $.eq(r.BSRelateAccount.uid, m.memberUid)
      )
      .join(
        'BSSubscribe',
        this.db.select('BSSubscribe'),
        // ['BSSubscribeMember', 'BSSubscribe', 'BSRelateChannelInfo'],
        (r, s) =>
          $.and(
            $.eq(r.BSSubscribeMember.subscribeId, s.id),
            $.eq(s.enable, true)
          )
      )
      .join(
        'BSSubRelateChannelInfo',
        this.db.select('BSRelateChannelInfo'),
        // ['BSSubscribeMember', 'BSSubscribe', 'BSRelateChannelInfo'],
        (r, c) => $.and($.eq(r.BSSubscribe.gid, c.id), $.eq(c.type, 'group'))
      )
      .execute()
    const res = subs.map((sub) => ({
      account: sub.BSRelateAccount,
      accountChannel: sub.BSRelateChannelInfo,
      subscribeMember: sub.BSSubscribeMember,
      subscribe: sub.BSSubscribe,
      groupChannel: sub.BSSubRelateChannelInfo,
    }))
    return res
  }

  async getAllSubScriptionByUIDAndPlatform(
    id: string | number,
    platform: string
  ): Promise<SubDetailWithGroupRes<ChannelInfo>[]> {
    const subs = await this.db
      .join(['BSRelateAccount', 'BSRelateChannelInfo'], (acc, c1) =>
        $.and(
          $.eq(acc.platformUid, id?.toString()),
          $.eq(acc.platform, platform),
          $.eq(acc.uid, c1.id),
          $.eq(c1.type, 'user')
        )
      )
      .join('BSSubscribeMember', this.db.select('BSSubscribeMember'), (r, m) =>
        $.eq(r.BSRelateAccount.uid, m.memberUid)
      )
      .join('BSSubscribe', this.db.select('BSSubscribe'), (r, s) =>
        $.and($.eq(r.BSSubscribeMember.subscribeId, s.id), $.eq(s.enable, true))
      )
      .join(
        'BSSubRelateChannelInfo',
        this.db.select('BSRelateChannelInfo'),
        (r, c) => $.and($.eq(r.BSSubscribe.gid, c.id), $.eq(c.type, 'group'))
      )
      .execute()
    const res = subs.map((sub) => ({
      account: sub.BSRelateAccount,
      accountChannel: sub.BSRelateChannelInfo,
      subscribeMember: sub.BSSubscribeMember,
      subscribe: sub.BSSubscribe,
      groupChannel: sub.BSSubRelateChannelInfo,
    }))
    return res
  }
  // async getSubscriptionInfoByType2(
  //   type: string
  // ): Promise<SubWithGroupRes<ChannelInfo>[]> {
  //   const subs = await this.db
  //     .join(['BSSubscribe', 'BSRelateChannelInfo'], (sub, c1) =>
  //       $.and(
  //         $.eq(sub.gid, c1.id),
  //         $.eq(sub.type, type),
  //         $.eq(sub.enable, true),
  //         $.eq(c1.type, 'group')
  //       )
  //     ).join('BSSubscribe', this.db.select('BSSubscribe'), (r, s) =>
  //       $.and($.eq(r.BSSubscribeMember.subscribeId, s.id), $.eq(s.enable, true))
  //     )
  //     .execute()
  //   const res = subs.map((sub) => ({
  //     subscribe: sub.BSSubscribe,
  //     groupChannel: sub.BSRelateChannelInfo,
  //   }))
  //   return res
  // }
  async getSubscriptionInfoByType(
    type: string
  ): Promise<SubWithGroupRes<ChannelInfo>[]> {
    const subs = await this.db
      .join(['BSSubscribe', 'BSRelateChannelInfo'], (sub, c1) =>
        $.and(
          $.eq(sub.gid, c1.id),
          $.eq(sub.type, type),
          $.eq(sub.enable, true),
          $.eq(c1.type, 'group')
        )
      )
      .execute()
    const res = subs.map((sub) => ({
      subscribe: sub.BSSubscribe,
      groupChannel: sub.BSRelateChannelInfo,
    }))
    return res
  }
}
