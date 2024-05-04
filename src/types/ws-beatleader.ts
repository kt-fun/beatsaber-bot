export interface WSBeatLeader {
  accLeft: number;
  accPP: number;
  accRight: number;
  accuracy: number;
  badCuts: number;
  baseScore: number;
  bombCuts: number;
  bonusPp: number;
  contextExtensions: ContextExtension[];
  controller: number;
  country: string;
  fcAccuracy: number;
  fcPp: number;
  fullCombo: boolean;
  hmd: number;
  id: number;
  leaderboard: Leaderboard;
  leaderboardId: string;
  maxCombo: number;
  maxStreak: number;
  metadata: null;
  missedNotes: number;
  modifiedScore: number;
  modifiers: string;
  myScore: null;
  offsets: Offsets;
  passPP: number;
  pauses: number;
  platform: string;
  playCount: number;
  player: Player;
  playerId: string;
  pp: number;
  rank: number;
  rankVoting: null;
  replay: string;
  replaysWatched: number;
  scoreImprovement: WSBeatLeaderScoreImprovement;
  techPP: number;
  timepost: number;
  timeset: string;
  validContexts: number;
  wallsHit: number;
  weight: number;
  [property: string]: any;
}

export interface ContextExtension {
  accPP: number;
  accuracy: number;
  baseScore: number;
  bonusPp: number;
  context: number;
  id: number;
  modifiedScore: number;
  modifiers: string;
  passPP: number;
  playerId: string;
  pp: number;
  rank: number;
  scoreImprovement: ContextExtensionScoreImprovement;
  techPP: number;
  weight: number;
  [property: string]: any;
}

export interface ContextExtensionScoreImprovement {
  accLeft: number;
  accRight: number;
  accuracy: number;
  averageRankedAccuracy: number;
  badCuts: number;
  bombCuts: number;
  bonusPp: number;
  id: number;
  missedNotes: number;
  pauses: number;
  pp: number;
  rank: number;
  score: number;
  timeset: string;
  totalPp: number;
  totalRank: number;
  wallsHit: number;
  [property: string]: any;
}

export interface Leaderboard {
  difficulty: Difficulty;
  id: string;
  song: Song;
  [property: string]: any;
}

export interface Difficulty {
  accRating: null;
  bombs: number;
  difficultyName: string;
  duration: number;
  featureTags: number;
  id: number;
  maxScore: number;
  mode: number;
  modeName: string;
  modifiersRating: null;
  modifierValues: ModifierValues;
  njs: number;
  nominatedTime: number;
  notes: number;
  nps: number;
  passRating: null;
  predictedAcc: number;
  qualifiedTime: number;
  rankedTime: number;
  requirements: number;
  speedTags: number;
  stars?: number|null;
  status: number;
  styleTags: number;
  techRating: null;
  type: number;
  value: number;
  walls: number;
  [property: string]: any;
}

export interface ModifierValues {
  da: number;
  fs: number;
  gn: number;
  modifierId: number;
  na: number;
  nb: number;
  nf: number;
  no: number;
  op: number;
  pm: number;
  sa: number;
  sc: number;
  sf: number;
  ss: number;
  [property: string]: any;
}

export interface Song {
  author: string;
  bpm: number;
  collaboratorIds: null;
  coverImage: string;
  duration: number;
  fullCoverImage: null;
  hash: string;
  id: string;
  mapper: string;
  mapperId: number;
  name: string;
  subName: string;
  [property: string]: any;
}

export interface Offsets {
  frames: number;
  heights: number;
  id: number;
  notes: number;
  pauses: number;
  walls: number;
  [property: string]: any;
}

export interface Player {
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
  profileSettings: ProfileSettings;
  rank: number;
  role: string;
  socials: null;
  [property: string]: any;
}

export interface ProfileSettings {
  bio: null;
  effectName: string;
  hue: number;
  id: number;
  leftSaberColor: null;
  message: null;
  profileAppearance: string;
  profileCover: string;
  rightSaberColor: null;
  saturation: number;
  showAllRatings: boolean;
  showBots: boolean;
  showStatsPublic: boolean;
  starredFriends: string;
  [property: string]: any;
}

export interface WSBeatLeaderScoreImprovement {
  accLeft: number;
  accRight: number;
  accuracy: number;
  averageRankedAccuracy: number;
  badCuts: number;
  bombCuts: number;
  bonusPp: number;
  id: number;
  missedNotes: number;
  pauses: number;
  pp: number;
  rank: number;
  score: number;
  timeset: string;
  totalPp: number;
  totalRank: number;
  wallsHit: number;
  [property: string]: any;
}
