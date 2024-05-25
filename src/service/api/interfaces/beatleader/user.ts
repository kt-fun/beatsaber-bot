
export interface BeatLeaderUser {
  accPp: number;
  avatar: string;
  badges: BLBadge[];
  banDescription: null;
  banned: boolean;
  bot: boolean;
  changes: BLChange[];
  clanOrder: string;
  clans: BLClan[];
  contextExtensions: null;
  country: string;
  countryRank: number;
  eventsParticipating: null;
  externalProfileUrl: string;
  history: null;
  id: string;
  inactive: boolean;
  lastWeekCountryRank: number;
  lastWeekPp: number;
  lastWeekRank: number;
  mapperId: number;
  name: string;
  passPp: number;
  patreonFeatures: null;
  pinnedScores: null;
  platform: string;
  pp: number;
  profileSettings: BLProfileSettings;
  rank: number;
  role: string;
  scoreStats: BLScoreStats;
  socials: BLSocial[];
  techPp: number;
  "topHMD": number,
  "sspPlays": number,
  "ssPlays": number,
  "spPlays": number,
  "sPlays": number,
  "aPlays": number,
  [property: string]: any;
}

export interface BLBadge {
  description: string;
  hidden: boolean;
  id: number;
  image: string;
  link: string;
  timeset: number;
  [property: string]: any;
}

export interface BLChange {
  changer: null | string;
  id: number;
  newCountry: null | string;
  newName: null | string;
  oldCountry: string;
  oldName: null | string;
  playerId: string;
  timestamp: number;
  [property: string]: any;
}

export interface BLClan {
  color: string;
  id: number;
  name: null;
  tag: string;
  [property: string]: any;
}

export interface BLProfileSettings {
  bio: null;
  effectName: string;
  hue: number;
  id: number;
  leftSaberColor: string;
  message: null;
  profileAppearance: string;
  profileCover: string;
  rightSaberColor: string;
  saturation: number;
  showAllRatings: boolean;
  showBots: boolean;
  starredFriends: string;
  [property: string]: any;
}

export interface BLScoreStats {
  anonimusReplayWatched: number;
  aPlays: number;
  authorizedReplayWatched: number;
  averageAccuracy: number;
  averageLeftTiming: number;
  averageRank: number;
  averageRankedAccuracy: number;
  averageRankedRank: number;
  averageRightTiming: number;
  averageUnrankedAccuracy: number;
  averageUnrankedRank: number;
  averageWeightedRankedAccuracy: number;
  averageWeightedRankedRank: number;
  countryTopPercentile: number;
  dailyImprovements: number;
  id: number;
  lastRankedScoreTime: number;
  lastScoreTime: number;
  lastUnrankedScoreTime: number;
  maxStreak: number;
  medianAccuracy: number;
  medianRankedAccuracy: number;
  peakRank: number;
  rankedImprovementsCount: number;
  rankedMaxStreak: number;
  rankedPlayCount: number;
  rankedTop1Count: number;
  rankedTop1Score: number;
  sPlays: number;
  spPlays: number;
  ssPlays: number;
  sspPlays: number;
  top1Count: number;
  top1Score: number;
  topAccPP: number;
  topAccuracy: number;
  topBonusPP: number;
  topHMD: number;
  topPassPP: number;
  topPercentile: number;
  topPlatform: string;
  topPp: number;
  topRankedAccuracy: number;
  topTechPP: number;
  topUnrankedAccuracy: number;
  totalImprovementsCount: number;
  totalPlayCount: number;
  totalRankedScore: number;
  totalScore: number;
  totalUnrankedScore: number;
  unrankedImprovementsCount: number;
  unrankedMaxStreak: number;
  unrankedPlayCount: number;
  unrankedTop1Count: number;
  unrankedTop1Score: number;
  watchedReplays: number;
  [property: string]: any;
}

export interface BLSocial {
  id: number;
  link: string;
  playerId: string;
  service: string;
  user: string;
  userId: string;
  [property: string]: any;
}

export interface BLPlayer {
  avatar: string;
  bot: boolean;
  clans: string[];
  contextExtensions: null;
  country: string;
  countryRank: number;
  id: string;
  name: string;
  patreonFeatures: null;
  platform: string;
  pp: number;
  profileSettings: null;
  rank: number;
  role: string;
  socials: null;
  [property: string]: any;
}
