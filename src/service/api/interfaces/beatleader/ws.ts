import {Leaderboard, Offsets, ScoreImprovement} from "./score";
import {BLPlayer} from "./user";

export interface BeatLeaderWSEvent {
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
  player: BLPlayer;
  playerId: string;
  pp: number;
  rank: number;
  rankVoting: null;
  replay: string;
  replaysWatched: number;
  scoreImprovement: ScoreImprovement;
  techPP: number;
  timepost: number;
  timeset: string;
  validContexts: number;
  wallsHit: number;
  weight: number;
  [property: string]: any;
}

export interface ContextExtension {
  accPP?: number;
  accuracy?: number;
  baseScore?: number;
  bonusPp?: number;
  context?: number;
  id?: number;
  modifiedScore?: number;
  modifiers?: string;
  passPP?: number;
  playerId?: string;
  pp?: number;
  rank?: number;
  scoreImprovement?: ContextExtensionScoreImprovement;
  techPP?: number;
  weight?: number;
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
