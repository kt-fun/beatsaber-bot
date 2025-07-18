import {User, Subscription, SubscriptionMember} from "@/index";
import {faker} from "@faker-js/faker";

const now = new Date()
const time = {createdAt: now, updatedAt: now}
export const users: User[] = [
  {id: '1', name: 'a', ...time},
  {id: '2', name: 'b', ...time},
  {id: '3', name: 'c', ...time},
]

export const getAccount = ({userId, accountId, providerId}) => {
  return {
    id: faker.string.uuid(),
    type: 'id',
    providerUsername: faker.person.fullName(),
    accountId,
    providerId,
    userId,
    ...time
  }
}

const accounts = [
  getAccount({userId: '1', accountId: 'test-1', providerId: 'test' }),
  getAccount({userId: '2', accountId: 'test-2', providerId: 'test' }),
  getAccount({userId: '3', accountId: 'test-3', providerId: 'test' }),
  // bind both
  getAccount({userId: '1', accountId: '1922350521131465', providerId: 'beatleader' }),
  getAccount({userId: '1', accountId: '1922350521131465', providerId: 'scoresaber' }),

  getAccount({userId: '3', accountId: '76561198988695829', providerId: 'scoresaber' }),
  // only beatleader
  getAccount({userId: '3', accountId: '76561198960449289', providerId: 'beatleader' }),
]

export const channels = [
  {id: '1', channelId: 'onebot:2', providerId: 'test', ...time},
  {id: '2', channelId: 'onebot:1', providerId: 'test', ...time},
  {id: '3', channelId: 'onebot:7', providerId: 'test', ...time},
]

export const subscriptionMembers: SubscriptionMember[] = [

  {memberId: '1', subscriptionId: '6', subscribeData: { }, ...time}, // 生效 1922350521131465
  {memberId: '1', subscriptionId: '7', subscribeData: { }, ...time}, // 未启用
  {memberId: '1', subscriptionId: '8', subscribeData: { }, ...time}, // 生效 1922350521131465


  // 未绑定账户
  {memberId: '2', subscriptionId: '6', subscribeData: { }, ...time}, // 未绑定
  {memberId: '2', subscriptionId: '7', subscribeData: { }, ...time}, // 未启用，未绑定
  {memberId: '2', subscriptionId: '8', subscribeData: { }, ...time}, // 未绑定
  // 未加入7,8
  {memberId: '3', subscriptionId: '6', subscribeData: { }, ...time}, // 生效 76561198960449289
]
export const subscriptions: Subscription[] = [
  { id: 'blscore::1::76561198960449289', type: 'blscore', eventType:'blscore-update', enabled: true, channelId: '1', data: { playerId: '76561198960449289' }, ...time },
  { id: '6', type: 'blscore-group', eventType:'blscore-update', enabled: true, channelId: '1', data: null, ...time },
  { id: '7', type: 'blscore-group', eventType:'blscore-update', enabled: false, channelId: '2', data: null, ...time },
  { id: '8', type: 'blscore-group', eventType:'blscore-update', enabled: true, channelId: '3', data: null, ...time },
]

export const mockData = {
  users,
  channels,
  accounts,
  subscriptions,
  subscriptionMembers,
  sess: {
    user: users[0],
    channel: channels[0],
    mentions: [],
    locale: 'zh-CN'
  }
}



export const getBeatleaderScoreEvent = (playerId: string) => ({
  contextExtensions: [
    {
      id: 35918161,
      playerId: '76561198866447318',
      weight: 0,
      rank: 383,
      baseScore: 97421,
      modifiedScore: 48710,
      accuracy: 0.27143195,
      pp: 0,
      passPP: 0,
      accPP: 0,
      techPP: 0,
      bonusPp: 0,
      modifiers: 'NF',
      context: 8,
      scoreImprovement: {
        id: 22792582,
        timeset: '',
        score: 0,
        accuracy: 0,
        pp: 0,
        bonusPp: 0,
        rank: 0,
        accRight: 0,
        accLeft: 0,
        averageRankedAccuracy: 0,
        totalPp: 0,
        totalRank: 0,
        badCuts: 0,
        missedNotes: 0,
        bombCuts: 0,
        wallsHit: 0,
        pauses: 0,
      },
    },
  ],
  myScore: null,
  validContexts: 10,
  leaderboard: {
    id: '2ad92xxx31',
    song: {
      id: '2ad92xxx',
      hash: '521F3F8BC77E1893D57768A44113CA8D7EB4B2EF',
      name: 'KICK BACK',
      subName: '(TV size)',
      author: 'Kenshi Yonezu',
      mapper: 'Narwhal & Jabob',
      mapperId: 72110,
      collaboratorIds: null,
      coverImage:
        'https://eu.cdn.beatsaver.com/521f3f8bc77e1893d57768a44113ca8d7eb4b2ef.jpg',
      bpm: 0,
      duration: 0,
      fullCoverImage: null,
    },
    difficulty: {
      id: 517447,
      value: 3,
      mode: 1,
      difficultyName: 'Normal',
      modeName: 'Standard',
      status: 0,
      modifierValues: {
        modifierId: 0,
        da: 0,
        fs: 0.2,
        sf: 0.36,
        ss: -0.3,
        gn: 0.04,
        na: -0.3,
        nb: -0.2,
        nf: -0.5,
        no: -0.2,
        pm: 0,
        sc: 0,
        sa: 0,
        op: -0.5,
      },
      modifiersRating: null,
      nominatedTime: 0,
      qualifiedTime: 0,
      rankedTime: 0,
      speedTags: 0,
      styleTags: 0,
      featureTags: 0,
      stars: null,
      predictedAcc: 0.9842995,
      passRating: null,
      accRating: null,
      techRating: null,
      type: 0,
      njs: 15,
      nps: 4.658,
      notes: 398,
      bombs: 5,
      walls: 66,
      maxScore: 358915,
      duration: 91,
      requirements: 16,
    },
  },
  accLeft: 81.47369,
  accRight: 76.78616,
  id: 14675079,
  baseScore: 97421,
  modifiedScore: 48710,
  accuracy: 0.27143195,
  playerId: playerId,
  pp: 0,
  bonusPp: 0,
  passPP: 0,
  accPP: 0,
  techPP: 0,
  rank: 423,
  country: 'CN',
  fcAccuracy: 0.6962122,
  fcPp: 0,
  weight: 0,
  replay:
    'https://cdn.replays.beatleader.xyz/14675079-76561198866447318-Normal-Standard-521F3F8BC77E1893D57768A44113CA8D7EB4B2EF.bsor',
  modifiers: 'NF',
  badCuts: 34,
  missedNotes: 53,
  bombCuts: 0,
  wallsHit: 2,
  pauses: 0,
  fullCombo: false,
  platform: 'steam,1.29.1_4575554838,0.7.1',
  maxCombo: 30,
  maxStreak: 0,
  hmd: 256,
  controller: 256,
  leaderboardId: '2ad92xxx31',
  timeset: '1714909495',
  timepost: 1714909590,
  replaysWatched: 0,
  playCount: 0,
  lastTryTime: 0,
  player: {
    id: playerId,
    name: 'WangDarkCHUI',
    platform: 'steam',
    avatar:
      'https://avatars.steamstatic.com/a37e8e801390e1e2aa43aacd2f0c782987ceb6a9_full.jpg',
    country: 'CN',
    bot: false,
    pp: 0,
    rank: 157997,
    countryRank: 995,
    role: '',
    socials: null,
    contextExtensions: null,
    patreonFeatures: null,
    profileSettings: null,
    clans: [],
  },
  scoreImprovement: {
    id: 22792583,
    timeset: '',
    score: 0,
    accuracy: 0,
    pp: 0,
    bonusPp: 0,
    rank: 0,
    accRight: 0,
    accLeft: 0,
    averageRankedAccuracy: 0,
    totalPp: 0,
    totalRank: 0,
    badCuts: 0,
    missedNotes: 0,
    bombCuts: 0,
    wallsHit: 0,
    pauses: 0,
  },
  rankVoting: null,
  metadata: null,
  offsets: {
    id: 14256248,
    frames: 327,
    notes: 669448,
    walls: 700661,
    heights: 700698,
    pauses: 725119,
  },
})
