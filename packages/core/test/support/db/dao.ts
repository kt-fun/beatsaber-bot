// 假设您的 schema 文件名为 'schema.ts'
import {account, bsSubscribe, bsSubscribeMember, bsUserPreference, channel, user} from './schema.js';
import {BetterSQLite3Database} from "drizzle-orm/better-sqlite3";
import {aliasedTable, and, count, eq, inArray, or, SQL, sql} from 'drizzle-orm';
import {
  Account,
  AddSubscriptionMember,
  DB,
  EventTarget,
  mergeEventTargets,
  SubInfoRes,
  Subscription,
  SubWithGroupRes
} from "@/index";
type DrizzleSchema = typeof import('./schema');
type DrizzleDb = BetterSQLite3Database<DrizzleSchema>;
type RelateAccount = typeof account.$inferSelect;

export class DrizzleDB implements DB {
  private db: DrizzleDb;

  constructor(db: DrizzleDb) {
    this.db = db;
  }

  getSubscriptionByChannelIDAndType(gid: string, type: string): Promise<Subscription[]> {
    return this.db.select()
      .from(bsSubscribe)
      .where(and(
        eq(bsSubscribe.type, type),
        eq(bsSubscribe.channelId, gid),
      ))
  }

  getSubscriptionByChannelID(gid: string): Promise<Subscription[]> {
    return this.db.select()
      .from(bsSubscribe)
      .where(eq(bsSubscribe.channelId, gid));
    }

  /**
   * 更新或插入用户偏好设置
   */
  async storeUserPreference<V = any>(
    uid: string,
    value: V
  ) {
    await this.db.insert(bsUserPreference)
      .values({
        uid: uid,
        gid: "0",
        data: value ?? {},
      })
      .onConflictDoUpdate({
        target: [bsUserPreference.uid, bsUserPreference.gid],
        set: { data: value ?? {} },
      });
    return true
  }

  /**
   * 获取用户偏好设置
   */
  async getUserPreference<V = any>(uid: string): Promise<V> {
    const res = await this.db.select({ data: bsUserPreference.data })
      .from(bsUserPreference)
      .where(eq(bsUserPreference.uid, uid))
      .limit(1);

    return (res[0]?.data as V) ?? ({} as V);
  }

  /**
   * 根据 UID 获取用户绑定的平台账户
   */
  async getUserAccountsByUserId(uid: string) {
    return this.db.select()
      .from(account)
      .where(eq(account.userId, uid));
  }

  async getUserAccountsByUserIdAndType<T extends readonly string[]>(id: string, types: T): Promise<Record<T[number], Account>> {
    const accounts = await this.db.select()
      .from(account)
      .where(and(
        eq(account.userId, id),
        inArray(account.providerId, types)
      ));
    const res = types.reduce((acc, cur) => {
      acc[cur] = accounts.find(it => it.providerId === cur)
      return acc
    }, {} as Record<T[number], Account>)
    return res
  }

  /**
   * 根据群组 GID 和用户 UID 获取订阅信息
   * 注意: 原查询中的 me: (row) => $.in(uid, $.array(...)) 不是标准SQL。
   * 这里使用条件聚合来模拟，结果中的 me 将是 boolean 类型。
   */
  async getSubscriptionInfoByUserAndChannelID(userId: string, channelId: string): Promise<SubInfoRes[]> {
    const isMember = sql<number>`SUM(CASE WHEN ${bsSubscribeMember.memberId} = ${userId} THEN 1 ELSE 0 END) > 0`.as('me');
    const rows = await this.db
      .select({
        subscription: bsSubscribe,
        memberCount: count(bsSubscribeMember.memberId),
        me: isMember,
      })
      .from(bsSubscribe)
      .leftJoin(bsSubscribeMember, eq(bsSubscribe.id, bsSubscribeMember.subscriptionId))
      .where(eq(bsSubscribe.channelId, channelId))
      .groupBy(bsSubscribe.id);
    return rows.map(row => ({
      ...row,
      me: !!row.me
    }));
  }

  async getSubscriptionMemberByUserChannelAndType(userId: string, channelId: string, type: string): Promise<SubInfoRes | null> {
    const isMember = sql<number>`SUM(CASE WHEN ${bsSubscribeMember.memberId} = ${userId} THEN 1 ELSE 0 END) > 0`.as('me');

    const rows = await this.db
      .select({
        subscription: bsSubscribe,
        memberCount: count(bsSubscribeMember.memberId),
        me: isMember,
      })
      .from(bsSubscribe)
      .leftJoin(bsSubscribeMember, eq(bsSubscribe.id, bsSubscribeMember.subscriptionId))
      .where(and(eq(bsSubscribe.type, type), eq(bsSubscribe.channelId, channelId)))
      .groupBy(bsSubscribe.id)
      .limit(1);
    return rows.map(row => ({
      ...row,
      me: !!row.me
    }))[0] ?? null;
  }
  async getSubscriptionByID(id: string): Promise<Subscription | null> {
    const [res] = await this.db.select()
      .from(bsSubscribe)
      .where(eq(bsSubscribe.id, id)).limit(1);
    return res ?? null
  }

  async getGroupSubscriptionByChannelIDAndType(channelId: string, type: string): Promise<Subscription | null> {
    const res = await this.db.select()
      .from(bsSubscribe)
      .where(and(
        eq(bsSubscribe.channelId, channelId),
        eq(bsSubscribe.type, type),
      )).limit(1);
    return res[0] ?? null
  }

  /**
   * 更新或插入订阅
   */
  async upsertSubscription(data: Partial<Subscription>): Promise<void> {
    await this.db.insert(bsSubscribe)
      .values(data as Subscription)
      .onConflictDoUpdate({
        target: bsSubscribe.id,
        set: data,
      });
  }

  /**
   * 添加订阅成员
   */
  async addSubscriptionMember(data: AddSubscriptionMember): Promise<void> {
    const now = new Date()
    data.createdAt = data.createdAt ?? now
    data.updatedAt = data.updatedAt ?? now
    data.subscribeData = {}
    await this.db.insert(bsSubscribeMember)
      .values(data as any)
      .onConflictDoNothing(); // 或者 onConflictDoUpdate，取决于业务逻辑
  }

  /**
   * 添加用户绑定信息
   */
  async addUserAccount(acc: Partial<RelateAccount>): Promise<void> {
    await this.db.insert(account)
      .values(acc as RelateAccount)
      .onConflictDoUpdate({
        target: account.id,
        set: acc,
      });
  }

  /**
   * 移除订阅成员
   */
  async removeSubscriptionMemberBySubIdAndMemberId(subId: string, id: string): Promise<void> {
    await this.db.delete(bsSubscribeMember)
      .where(and(
        eq(bsSubscribeMember.subscriptionId, subId),
        eq(bsSubscribeMember.memberId, id)
      ));
  }

  /**
   * 根据 GID 和类型获取 ID 订阅
   */
  async getIDSubscriptionByGIDAndType(gid: string, type: string): Promise<Subscription[]> {
    return this.db.select()
      .from(bsSubscribe)
      .where(and(
        eq(bsSubscribe.channelId, gid),
        eq(bsSubscribe.type, type)
      )).limit(1);
  }

  /**
   * 根据 ID 移除订阅
   */
  async removeSubscriptionByID(id: string): Promise<void> {
    await this.db.delete(bsSubscribe).where(eq(bsSubscribe.id, id));
    await this.db.delete(bsSubscribeMember).where(eq(bsSubscribeMember.subscriptionId, id));
  }

  /**
   * 根据 GID 获取订阅
   */
  async getSubscriptionsByChannelID(gid: string): Promise<Subscription[]> {
    const res = await this.db.select()
      .from(bsSubscribe)
      .where(eq(bsSubscribe.channelId, gid));
    return res
  }

  async getScheduleEventTargets(type: string): Promise<EventTarget[]> {

    const rows = await this.db.select({
      channel: channel,
      subscription: bsSubscribe,
    })
      .from(channel)
      .innerJoin(bsSubscribe, and(
        eq(bsSubscribe.enabled, true),
        eq(bsSubscribe.channelId, channel.id),
        eq(bsSubscribe.eventType, 'schedule'),
        eq(bsSubscribe.type, type),
      ))
    return rows.map(it => ({
      channel: it.channel,
      users: [],
      subscriptions: [it.subscription]
    }))
  }


  async getBLScoreEventTargets(playerId: string): Promise<EventTarget[]> {
    const providerId = 'beatleader'
    const commonQuery = [
      eq(bsSubscribe.enabled, true),
      eq(channel.id, bsSubscribe.channelId),
      eq(bsSubscribe.eventType, 'blscore-update'),
    ]
    const part1 = await this.getCommonEventTargets(and(
        ...commonQuery,
      eq(bsSubscribe.type, 'blscore'),
      eq(sql`json_extract(${bsSubscribe.data}, '$.playerId')`, playerId)
    ))
    const part2 = await this.getEventTargetsByAccount(providerId, playerId, and(
      ...commonQuery,
      eq(bsSubscribe.type, 'blscore-group')
    ))
    return mergeEventTargets(part1, part2)
  }

  async getBSMapEventTargets(mapperId: string): Promise<EventTarget[]> {
    const providerId = 'beatsaver'
    const commonQuery = [
      eq(bsSubscribe.enabled, true),
      eq(channel.id, bsSubscribe.channelId),
      eq(bsSubscribe.eventType, 'bsmap-update'),
    ]
    const part1 = await this.getCommonEventTargets(and(
      ...commonQuery,
      eq(bsSubscribe.type, 'bsmap'),
      eq(sql`json_extract(${bsSubscribe.data}, '$.mapperId')`, mapperId)
    ))
    const part2 = await this.getEventTargetsByAccount(providerId, mapperId, and(
      ...commonQuery,
      eq(bsSubscribe.type, 'bsmap-group')
    ))
    return mergeEventTargets(part1, part2)
  }

  private async getCommonEventTargets(q: SQL<unknown>): Promise<EventTarget[]> {
    const rows = await this.db.select({
      channel: channel,
      subscription: bsSubscribe,
    })
      .from(channel)
      .innerJoin(bsSubscribe, and(
        eq(bsSubscribe.enabled, true),
        eq(bsSubscribe.channelId, channel.id),
        q
      ))
    return rows.map(it => ({
      channel: it.channel,
      users: [],
      subscriptions: [it.subscription]
    }))
  }
  private async getEventTargetsByAccount(providerId: string, accountId: string, subscriptionQuery: SQL<unknown>): Promise<EventTarget[]> {
    const channelAccount = aliasedTable(account, 'channel_account')
    const sqls = this.db.select({
        channel: channel,
        subscriptionMember: bsSubscribeMember,
        subscription: bsSubscribe,
        account: account,
        user: user,
        channelAccount: channelAccount
      })
      .from(channel)
      .innerJoin(bsSubscribe, subscriptionQuery)
      .innerJoin(bsSubscribeMember, eq(bsSubscribe.id, bsSubscribeMember.subscriptionId))
      .innerJoin(account, and(
        eq(bsSubscribeMember.memberId, account.userId),
        eq(account.providerId, providerId),
        eq(account.accountId, accountId)
      ))
      .innerJoin(user, eq(account.userId, user.id))
      .innerJoin(channelAccount, and(
        eq(channelAccount.userId, user.id),
        eq(channelAccount.providerId, channel.providerId),
      ))
    const rows = await sqls
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
  // event-type
}
