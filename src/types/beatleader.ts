// bsMapper
export interface BeatLeaderPlayerScoreRequest {
  diff: string,
  mode: string,
  hash: string,
  playerID: string,
  leaderboardContext: string
}

export interface BeadLeaderScoresResponse {
  data: Score[];
  metadata: Metadata;
  [property: string]: any;
}

export interface Score {
  accLeft: number;
  accPP: number;
  accRight:  number;
  accuracy: number;
  badCuts: number;
  baseScore: number;
  bombCuts: number;
  bonusPp:  number;
  contextExtensions: null;
  controller: number;
  country: null | string;
  fcAccuracy:  number;
  fcPp:  number;
  fullCombo: boolean;
  hmd: number;
  id: number;
  leaderboard: Leaderboard;
  leaderboardId: string;
  maxCombo: number;
  maxStreak: number | null;
  metadata: null;
  missedNotes: number;
  modifiedScore: number;
  modifiers: string;
  myScore: null;
  offsets: Offsets;
  passPP:  number;
  pauses: number;
  platform: string;
  playCount: number;
  player: any;
  playerId: string;
  pp: number;
  priority: number;
  rank: number;
  rankVoting: null;
  replay: string;
  replaysWatched: number;
  scoreImprovement: ScoreImprovement;
  techPP: number ;
  timepost: number;
  timeset: string;
  validContexts: number;
  wallsHit: number;
  weight: number;
  [property: string]: any;
}

export interface Leaderboard {
  difficulty: Difficulty;
  id: string;
  song: Song;
  [property: string]: any;
}

export interface Difficulty {
  accRating: number | null;
  bombs: number;
  difficultyName: string;
  duration: number;
  id: number;
  maxScore: number;
  mode: number;
  modeName: string;
  modifiersRating: null | ModifiersRating;
  modifierValues: ModifierValues;
  njs: number;
  nominatedTime: number;
  notes: number;
  nps: number;
  passRating: number | null;
  predictedAcc: number;
  qualifiedTime: number;
  rankedTime: number;
  requirements: number;
  stars: number | null;
  status: number;
  techRating: number | null;
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

export interface ModifiersRating {
  fsAccRating: number;
  fsPassRating: number;
  fsPredictedAcc: number;
  fsStars: number;
  fsTechRating: number;
  id: number;
  sfAccRating: number;
  sfPassRating: number;
  sfPredictedAcc: number;
  sfStars: number;
  sfTechRating: number;
  ssAccRating: number;
  ssPassRating: number;
  ssPredictedAcc: number;
  ssStars: number;
  ssTechRating: number;
  [property: string]: any;
}

export interface Song {
  author: string;
  bpm: number;
  collaboratorIds: null;
  coverImage: string;
  duration: number;
  fullCoverImage: string;
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

export interface ScoreImprovement {
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

export interface Metadata {
  itemsPerPage: number;
  page: number;
  total: number;
  [property: string]: any;
}
