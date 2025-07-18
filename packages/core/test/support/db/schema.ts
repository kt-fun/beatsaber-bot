import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';

export const account = sqliteTable('account', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  providerId: text('provider_id').notNull(),
  type: text('type').notNull(),
  providerUsername: text('provider_name').notNull(),
  accountId: text('account_id').notNull(),
  scope: text('scope'),
  accessToken: text('access_token'),
  accessTokenExpiresAt: integer('access_token_expires_at', {mode: 'timestamp'}),
  refreshToken: text('refresh_token'),
  refreshTokenExpiresAt: integer('refresh_token_expires_at', {mode: 'timestamp'}),
  idToken: text('id_token'),
  metadata: text('metadata', { mode: 'json' }),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
});

// BSSubscribeMember Table
export const bsSubscribeMember = sqliteTable('BSSubscribeMember', {
  subscriptionId: text('subscribe_id').notNull(),
  memberId: text('member_id').notNull(),
  subscribeData: text('subscribe_data', { mode: 'json' }),
  createdAt: integer('created_at', {mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updated_at', {mode: 'timestamp_ms' }).notNull(),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.subscriptionId, table.memberId] }),
  };
});

// BSSubscribe Table
export const bsSubscribe = sqliteTable('BSSubscribe', {
  id: text('id').primaryKey(),
  channelId: text('channel_id').notNull(),
  enabled: integer('enabled', { mode: 'boolean' }).notNull(),
  type: text('type').notNull(),
  eventType: text('event_type').notNull(),
  data: text('data', { mode: 'json' }),
  createdAt: integer('created_at', {mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updated_at', {mode: 'timestamp_ms' }).notNull(),
});


// BSUserPreference Table
export const bsUserPreference = sqliteTable('BSUserPreference', {
  uid: text('uid').notNull(),
  gid: text('gid'),
  data: text('data', { mode: 'json' }),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.uid, table.gid] }),
  };
});


export const user = sqliteTable('user', {
  id: text('id').primaryKey(),
  name: text('name'),
  createdAt: integer('created_at', {mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updated_at', {mode: 'timestamp_ms' }).notNull(),
})

export const channel = sqliteTable('channel', {
  id: text('id').primaryKey(),
  channelId: text('channel_id').notNull(),
  providerId: text('provider_id').notNull(),
  createdAt: integer('created_at', {mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updated_at', {mode: 'timestamp_ms' }).notNull(),
})
