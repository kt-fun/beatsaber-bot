export interface BSRelateOAuthAccount {
  id: number,
  uid: number,
  platform: string,
  platformUid: string,
  platformScope: string,
  platformUname: string,
  otherPlatformInfo: any,
  accessToken: string,
  refreshToken: string,
  lastModifiedAt: Date,
  lastRefreshAt: Date,
  valid: string,
  type: string,
}

export interface BSBotSubscribe {
  id: number,
  platform: string,
  selfId: string,
  channelId: string|null,
  enable: boolean,
  uid: string,
  time: Date,
  type: string,
  data: {
    [key: string]: any
  }
}

export interface BSSubscribeMember {
  id: number,
  subscribeId: number,
  memberUid: number,
  subscribeData: any,
  joinedAt: Date,
}

export interface BeatSaverMapMessage {
  id: number,
  platform: string,
  mapId: string,
  messageId: number,
}
