//@ts-nocheck
import { Context } from 'koishi'
import { ChannelInfo } from '@/types'
export * from './db'

import {
  RelateAccount,
  Subscribe,
  SubscribeMember,
  UserAndUGroupRel,
  RelateChannelInfo,
} from 'beatsaber-bot-core'
declare module 'koishi' {
  interface Tables {
    BSRelateAccount: RelateAccount
    BSRelateChannelInfo: RelateChannelInfo<ChannelInfo>
    BSSubscribe: Subscribe
    BSSubscribeMember: SubscribeMember
    BSUserAndUGroupRel: UserAndUGroupRel
  }
}

// check beats-bot-core/db/index.ts
export function InitDBModel(ctx: Context) {
  ctx.model.extend(
    'BSRelateAccount',
    {
      id: 'unsigned',
      uid: 'unsigned',
      type: 'string',
      accountId: 'unsigned',
      platform: 'string',
      platformUname: 'string',
      platformUid: 'string',
      platformScope: 'string',
      accessToken: 'string',
      refreshToken: 'string',
      otherPlatformInfo: 'json',
      lastModifiedAt: 'timestamp',
      lastRefreshAt: 'timestamp',
      valid: 'string',
    },
    {
      autoInc: true,
    }
  )

  ctx.model.extend(
    'BSSubscribeMember',
    {
      id: 'unsigned',
      subscribeId: 'unsigned',
      memberUid: 'unsigned',
      subscribeData: 'json',
      joinedAt: 'date',
    },
    {
      autoInc: true,
    }
  )

  ctx.model.extend(
    'BSSubscribe',
    {
      id: 'unsigned',
      gid: 'unsigned',
      enable: 'boolean',
      type: 'string',
      data: 'json',
    },
    { autoInc: true }
  )

  ctx.model.extend(
    'BSUserAndUGroupRel',
    {
      uid: 'unsigned',
      gid: 'unsigned',
      nickname: 'string',
    },
    {
      primary: ['uid', 'gid'],
    }
  )

  ctx.model.extend(
    'BSRelateChannelInfo',
    {
      // uid or gid
      id: 'unsigned',
      name: 'string',
      type: 'string',
      enabled: 'boolean',
      platform: 'string',
      selfId: 'string',
      channelId: 'string',
      uid: 'string',
    },
    {
      autoInc: true,
      primary: ['id', 'type'],
    }
  )
}
