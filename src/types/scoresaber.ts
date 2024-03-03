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
