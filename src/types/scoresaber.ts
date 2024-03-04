export interface ScoreSaberUser {
  badges: Badge[];
  banned: boolean;
  bio: string;
  country: string;
  countryRank: number;
  firstSeen: string;
  histories: string;
  id: string;
  inactive: boolean;
  name: string;
  permissions: number;
  pp: number;
  profilePicture: string;
  rank: number;
  role: null;
  scoreStats: ScoreStats;
  [property: string]: any;
}

export interface Badge {
  description?: string;
  image?: string;
  [property: string]: any;
}

export interface ScoreStats {
  averageRankedAccuracy: number;
  rankedPlayCount: number;
  replaysWatched: number;
  totalPlayCount: number;
  totalRankedScore: number;
  totalScore: number;
  [property: string]: any;
}


export interface BeatLeaderResponse {
  playerScores: BeatLeaderItem[],
  metadata:{
    total: number,
    page: number,
    itemsPerPage: number
  }
}


export interface BeatLeaderItem{
  score: BeatScore,
  leaderboard: LeaderBoard
}

interface BeatScore {
  id: number,
  leaderboardPlayerInfo: any,
  rank: number,
  baseScore: number,
  modifiedScore: number,
  pp: number,
  weight: number,
  modifiers: string,
  multiplier: number,
  badCuts: number,
  missedNotes: number,
  maxCombo: number,
  fullCombo: boolean,
  hmd: number,
  timeSet: string,
  hasReplay: boolean,
  deviceHmd: string,
  deviceControllerLeft: string,
  deviceControllerRight: string,
}

interface LeaderBoard {
  id: number,
  songHash: string,
  songName: string,
  songSubName: string,
  songAuthorName: string,
  levelAuthorName: string,
  difficulty: {
    leaderboardId: number,
    difficulty: number,
    gameMode: string,
    difficultyRaw: string
  },
  maxScore: number,
  createdDate: string,
  rankedDate: string,
  qualifiedDate: string,
  lovedDate: any,
  ranked: boolean,
  qualified: boolean,
  loved: boolean,
  maxPP: number,
  stars: number,
  plays: number,
  dailyPlays: number,
  positiveModifiers: boolean,
  playerScore: any,
  coverImage: string,
  difficulties: any,
}
