import { Context } from 'koishi'
import { ChannelInfo } from '@/types'
export * from './db'

import {
  RelateAccount,
  Subscribe,
  SubscribeMember,
  RelateChannelInfo,
  UserPreference,
} from 'beatsaber-bot-core'

declare module 'koishi' {
  interface Tables {
    BSRelateAccount: RelateAccount
    BSRelateChannelInfo: RelateChannelInfo<ChannelInfo>
    BSSubscribe: Subscribe
    BSSubscribeMember: SubscribeMember
    BSUserPreference: UserPreference
  }
}

export function InitDBModel(ctx: Context) {
  ctx.model.extend(
    'BSRelateAccount',
    {
      id: 'unsigned',
      uid: 'unsigned',
      type: 'string',
      platform: 'string',
      platformUname: 'string',
      platformUid: 'string',
      platformScope: 'string',
      accessToken: 'string',
      refreshToken: 'string',
      otherPlatformInfo: 'json',
      lastModifiedAt: 'timestamp',
      lastRefreshAt: 'timestamp',
      status: 'string',
    },
    {
      autoInc: true,
    }
  )

  ctx.model.extend(
    'BSSubscribeMember',
    {
      subscribeId: 'unsigned',
      memberUid: 'unsigned',
      subscribeData: 'json',
      joinedAt: 'date',
    },
    {
      primary: ['subscribeId', 'memberUid'],
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
    'BSRelateChannelInfo',
    {
      // uid or gid
      id: 'unsigned',
      name: 'string',
      type: 'string',
      platform: 'string',
      selfId: 'string',
      channelId: 'string',
      uid: 'string',
    },
    {
      autoInc: true,
    }
  )

  ctx.model.extend(
    'BSUserPreference',
    {
      uid: 'unsigned',
      gid: {
        type: 'unsigned',
        nullable: true,
      },
      data: 'json',
    },
    { primary: ['uid', 'gid'] }
  )
}
