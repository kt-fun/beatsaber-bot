import { Context } from 'koishi'

import {
  Account,
  Subscription,
  SubscriptionMember,
  Preference,
  User,
  Channel,
} from 'beatsaber-bot-core'
export * from './db'
declare module 'koishi' {
  interface Tables {
    BSRelateAccount: Account
    BSSubscription: Subscription
    BSSubscriptionMember: SubscriptionMember
    BSUserPreference: Preference
    BSUser: User
    BSChannel: Channel
  }
}

export function InitDBModel(ctx: Context) {
  ctx.model.extend(
    'BSRelateAccount',
    {
      id: 'string',
      userId: 'string',
      providerId: 'string',
      accountId: 'string',
      type: 'string',
      providerUsername: {
        type: 'string',
        required: false,
      },
      scope: {
        type: 'string',
        required: false,
      },
      accessToken: {
        type: 'string',
        required: false,
      },
      refreshToken: {
        type: 'string',
        required: false,
      },
      accessTokenExpiresAt: {
        type: 'timestamp',
        required: false,
      },
      refreshTokenExpiresAt: {
        type: 'timestamp',
        required: false,
      },
      idToken: {
        type: 'string',
        required: false,
      },
      metadata: {
        type: 'json',
        required: false,
      },
      lastModifiedAt: 'timestamp',
      createdAt: 'timestamp',
      lastRefreshAt: 'timestamp',
    },
    {
      primary: ['id'],
    }
  )

  ctx.model.extend(
    'BSSubscriptionMember',
    {
      subscriptionId: 'string',
      memberId: 'string',
      subscriptionData: 'json',
      joinedAt: 'date',
      createdAt: 'date',
      updatedAt: 'date',
    },
    {
      primary: ['subscriptionId', 'memberId'],
    }
  )

  ctx.model.extend(
    'BSSubscription',
    {
      id: 'string',
      channelId: 'string',
      enabled: 'boolean',
      type: 'string',
      data: 'json',
    },
    {
      primary: ['id'],
    }
  )

  ctx.model.extend(
    'BSUserPreference',
    {
      uid: 'string',
      gid: {
        type: 'string',
        nullable: true,
      },
      data: 'json',
    },
    { primary: ['uid', 'gid'] }
  )


  ctx.model.extend(
    'BSUser',
    {
      id: 'string',
      name: 'string',
      createdAt: 'date',
      updatedAt: 'date',
    },
    {
      primary: ['id'],
    }
  )

  ctx.model.extend(
    'BSChannel',
    {
      id: 'string',
      channelId: 'string',
      providerId: 'string',
      createdAt: 'date',
      updatedAt: 'date',
    },
    {
      primary: ['id'],
    }
  )
}
