
// 假设您的 schema 文件名为 'schema.ts'
import {
  account,
  bsSubscribeMember,
  bsSubscribe,
  user,
  channel,
  bsUserPreference
} from './schema.js';
import {BetterSQLite3Database} from "drizzle-orm/better-sqlite3";
import {eq, and, inArray, count, sql} from 'drizzle-orm';
import type {
  DB,
  Subscription,
  SubWithGroupRes,
  SubDetailWithGroupRes,
  SubInfoRes,
  AddSubscriptionMember
} from "@/index";

// 定义 schema 类型，方便在类中使用
type DrizzleSchema = typeof import('./schema');
type DrizzleDb = BetterSQLite3Database<DrizzleSchema>;

// 定义一些来自您代码的、但未在此处定义的类型，以便代码能够通过类型检查
// 您需要将它们替换为实际的定义
type ChannelInfo = { platform: string; uid: string; selfId: string; channelId: string; };
type SubscribeMember = typeof bsSubscribeMember.$inferSelect;
type RelateAccount = typeof account.$inferSelect;
// b.ts
export class DrizzleDB implements DB {
  private db: DrizzleDb;

  constructor(db: DrizzleDb) {
    this.db = db;
  }


  getIDSubscriptionByChannelIDAndType(gid: string, type: string): Promise<Subscription[]> {
    return this.db.select()
      .from(bsSubscribe)
      .where(and(
        eq(bsSubscribe.type, type),
        eq(bsSubscribe.channelId, gid),
      ))
  }

  getIDSubscriptionByGID(gid: string): Promise<Subscription[]> {
    return this.db.select()
      .from(bsSubscribe)
      .where(eq(bsSubscribe.channelId, gid));
    }
  getIDSubscriptionByType(type: string): Promise<SubWithGroupRes[]> {
      throw new Error('Method not implemented.');
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
  async getUserAccountsByUid(uid: string) {
    console.log(`Getting user accounts for: ${uid}`);
    const accounts = await this.db.select()
      .from(account)
      .where(and(
        eq(account.userId, uid),
        inArray(account.providerId, ['scoresaber', 'beatleader', 'beatsaver'])
      ));
    const blAccount = accounts.find((it) => it.providerId === 'beatleader');
    const ssAccount = accounts.find((it) => it.providerId === 'scoresaber');
    const bsAccount = accounts.find((it) => it.providerId === 'beatsaver');

    return { blAccount, ssAccount, bsAccount };
  }

  /**
   * 根据群组 GID 和用户 UID 获取订阅信息
   * 注意: 原查询中的 me: (row) => $.in(uid, $.array(...)) 不是标准SQL。
   * 这里使用条件聚合来模拟，结果中的 me 将是 boolean 类型。
   */
  async getSubscriptionInfoByUGID(
    gid: string,
    uid: string
  ): Promise<SubInfoRes[]> {
    const isMember = sql<number>`SUM(CASE WHEN ${bsSubscribeMember.memberId} = ${uid} THEN 1 ELSE 0 END) > 0`.as('me');

    const rows = await this.db
      .select({
        subscription: bsSubscribe,
        memberCount: count(bsSubscribeMember.memberId),
        me: isMember,
      })
      .from(bsSubscribe)
      .leftJoin(bsSubscribeMember, eq(bsSubscribe.id, bsSubscribeMember.subscriptionId))
      .where(eq(bsSubscribe.channelId, gid))
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
  /**
   * 根据 GID 获取订阅
   */
  async getSubscriptionsByGID(gid: string): Promise<Record<string, Subscription>> {
    const res = await this.db.select()
      .from(bsSubscribe)
      .where(eq(bsSubscribe.channelId, gid));
    const blSub = res.find((it) => it.type === 'beatleader-score');
    const bsMapSub = res.find((it) => it.type === 'beatsaver-map');
    return { blSub, bsMapSub };
  }

  async getChannelSubscriptionByChannelIDAndType(channelId: string, type: string): Promise<Subscription | null> {
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
  async addSubscribeMember(data: AddSubscriptionMember): Promise<void> {
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
  async addUserBindingInfo(acc: Partial<RelateAccount>): Promise<void> {
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
  async removeFromSubGroupBySubAndUid(subId: string, id: string): Promise<void> {
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
  async removeIDSubscriptionByID(id: string): Promise<void> {
    await this.db.delete(bsSubscribe).where(eq(bsSubscribe.id, id));
  }

  /**
   * 根据平台和平台UID获取所有相关订阅的详细信息
   */
  async getAllSubscriptionByUIDAndPlatform(id: string, platform: string): Promise<SubDetailWithGroupRes[]> {

    // account: Account
    // user: User
    // channel: Channel
    // subscriptionMember: SubscriptionMember
    // subscription: Subscription
    const rows = await this.db.select({
      account: account,
      user: user,
      channel: channel,
      subscriptionMember: bsSubscribeMember,
      subscription: bsSubscribe,
    })
      .from(account)
      .innerJoin(user, eq(account.userId, user.id))
      .innerJoin(bsSubscribeMember, eq(account.userId, bsSubscribeMember.memberId))
      .innerJoin(bsSubscribe, and(
        eq(bsSubscribeMember.subscriptionId, bsSubscribe.id),
        eq(bsSubscribe.enabled, true)
      ))
      .innerJoin(channel, eq(bsSubscribe.channelId, channel.id))
      .where(and(
        eq(account.providerId, platform),
        eq(account.accountId, id)
      ));

    return rows;
  }

  /**
   * 根据类型获取所有启用的订阅
   */
  async getSubscriptionsByType(type: string): Promise<SubWithGroupRes[]> {
    const rows = await this.db.select({
      subscription: bsSubscribe,
      channel: channel
    })
      .from(bsSubscribe)
      .innerJoin(channel, eq(bsSubscribe.channelId, channel.id))
      .where(and(
        eq(bsSubscribe.enabled, true),
        eq(bsSubscribe.type, type)
      ));
    return rows
  }
}
