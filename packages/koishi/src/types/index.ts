import { RelateChannelInfo } from 'beatsaber-bot-core'

export interface BLScoreFilter {
  filterName: string
  filterParams: any[]
}

export interface ChannelInfo {
  uid: string
  channelId: string
  selfId: string
  platform: string
}

export type KoiRelateChannelInfo = RelateChannelInfo<ChannelInfo>
