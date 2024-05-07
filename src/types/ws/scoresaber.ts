/**
 * ApifoxModel
 */
export interface ScoreWSEvent {
  commandData: CommandData;
  commandName: string;
  [property: string]: any;
}

export interface CommandData {
  leaderboard: Leaderboard;
  score: Score;
  [property: string]: any;
}

export interface Leaderboard {
  coverImage: string;
  createdDate: string;
  dailyPlays: number;
  difficulties: null;
  difficulty: Difficulty;
  id: number;
  levelAuthorName: string;
  loved: boolean;
  lovedDate: null;
  maxPP: number;
  maxScore: number;
  playerScore: null;
  plays: number;
  positiveModifiers: boolean;
  qualified: boolean;
  qualifiedDate: string;
  ranked: boolean;
  rankedDate: string;
  songAuthorName: string;
  songHash: string;
  songName: string;
  songSubName: string;
  stars: number;
  [property: string]: any;
}

export interface Difficulty {
  difficulty: number;
  difficultyRaw: string;
  gameMode: string;
  leaderboardId: number;
  [property: string]: any;
}

export interface Score {
  badCuts: number;
  baseScore: number;
  deviceControllerLeft: string;
  deviceControllerRight: string;
  deviceHmd: string;
  fullCombo: boolean;
  hasReplay: boolean;
  hmd: number;
  id: number;
  leaderboardPlayerInfo: LeaderboardPlayerInfo;
  maxCombo: number;
  missedNotes: number;
  modifiedScore: number;
  modifiers: string;
  multiplier: number;
  pp: number;
  rank: number;
  timeSet: string;
  weight: number;
  [property: string]: any;
}

export interface LeaderboardPlayerInfo {
  badges: string;
  country: string;
  id: string;
  name: string;
  permissions: number;
  profilePicture: string;
  role: null;
  [property: string]: any;
}
