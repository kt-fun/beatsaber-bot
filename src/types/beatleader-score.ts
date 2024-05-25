/**
 * Score
 */
export interface Score {
  accLeft?: number;
  accPP?: number;
  accRight?: number;
  accuracy?: number;
  anonimusReplayWatched?: number;
  authorizedReplayWatched?: number;
  badCuts?: number;
  banned?: boolean;
  baseScore?: number;
  bombCuts?: number;
  bonusPp?: number;
  bot?: boolean;
  contextExtensions?: ScoreContextExtension[] | null;
  controller?: number;
  country?: null | string;
  countryRank?: number;
  fcAccuracy?: number;
  fcPp?: number;
  fullCombo?: boolean;
  hmd?: number;
  id?: number;
  ignoreForStats?: boolean;
  leaderboard?: Leaderboard;
  leaderboardId?: null | string;
  leftTiming?: number;
  maxCombo?: number;
  maxStreak?: number | null;
  metadata?: ScoreMetadata;
  migrated?: boolean;
  missedNotes?: number;
  modifiedScore?: number;
  modifiers?: null | string;
  passPP?: number;
  pauses?: number;
  platform?: null | string;
  playCount?: number;
  player?: Player;
  playerId?: null | string;
  pp?: number;
  priority?: number;
  qualification?: boolean;
  rank?: number;
  rankVoting?: RankVoting;
  replay?: null | string;
  replayOffsets?: ReplayOffsets;
  replayOffsetsId?: number | null;
  rightTiming?: number;
  scoreImprovement?: ScoreImprovement;
  scoreImprovementId?: number | null;
  suspicious?: boolean;
  techPP?: number;
  timepost?: number;
  timeset?: null | string;
  validContexts?: number;
  wallsHit?: number;
  weight?: number;
}

/**
 * Score
 */
export interface ScoreElement {
  accLeft?: number;
  accPP?: number;
  accRight?: number;
  accuracy?: number;
  anonimusReplayWatched?: number;
  authorizedReplayWatched?: number;
  badCuts?: number;
  banned?: boolean;
  baseScore?: number;
  bombCuts?: number;
  bonusPp?: number;
  bot?: boolean;
  contextExtensions?: ScoreContextExtension[] | null;
  controller?: number;
  country?: null | string;
  countryRank?: number;
  fcAccuracy?: number;
  fcPp?: number;
  fullCombo?: boolean;
  hmd?: number;
  id?: number;
  ignoreForStats?: boolean;
  leaderboard?: Leaderboard;
  leaderboardId?: null | string;
  leftTiming?: number;
  maxCombo?: number;
  maxStreak?: number | null;
  metadata?: ScoreMetadata;
  migrated?: boolean;
  missedNotes?: number;
  modifiedScore?: number;
  modifiers?: null | string;
  passPP?: number;
  pauses?: number;
  platform?: null | string;
  playCount?: number;
  player?: Player;
  playerId?: null | string;
  pp?: number;
  priority?: number;
  qualification?: boolean;
  rank?: number;
  rankVoting?: RankVoting;
  replay?: null | string;
  replayOffsets?: ReplayOffsets;
  replayOffsetsId?: number | null;
  rightTiming?: number;
  scoreImprovement?: ScoreImprovement;
  scoreImprovementId?: number | null;
  suspicious?: boolean;
  techPP?: number;
  timepost?: number;
  timeset?: null | string;
  validContexts?: number;
  wallsHit?: number;
  weight?: number;
}

/**
 * PlayerLeaderboardStats
 */
export interface PlayerLeaderboardStats {
  accLeft?: number;
  accPP?: number;
  accRight?: number;
  accuracy?: number;
  anonimusReplayWatched?: number;
  authorizedReplayWatched?: number;
  badCuts?: number;
  baseScore?: number;
  bombCuts?: number;
  bonusPp?: number;
  controller?: number;
  country?: null | string;
  countryRank?: number;
  fcAccuracy?: number;
  fcPp?: number;
  fullCombo?: boolean;
  hmd?: number;
  id?: number;
  leaderboard?: Leaderboard;
  leaderboardId?: null | string;
  leftTiming?: number;
  maxCombo?: number;
  maxStreak?: number | null;
  missedNotes?: number;
  modifiedScore?: number;
  modifiers?: null | string;
  passPP?: number;
  pauses?: number;
  platform?: null | string;
  playerId?: null | string;
  pp?: number;
  priority?: number;
  qualification?: boolean;
  rank?: number;
  replay?: null | string;
  replayOffsets?: ReplayOffsets;
  replayOffsetsId?: number | null;
  rightTiming?: number;
  score?: number;
  scoreId?: number | null;
  scoreImprovement?: ScoreImprovement;
  scoreImprovementId?: number | null;
  techPP?: number;
  time?: number;
  timepost?: number;
  timeset?: number;
  type?: number;
  wallsHit?: number;
  weight?: number;
}

/**
 * LeaderboardGroup
 */
export interface LeaderboardGroup {
  id?: number;
  leaderboards?: Leaderboard[] | null;
}

/**
 * EventRanking
 */
export interface EventRanking {
  endDate?: number;
  id?: number;
  image?: null | string;
  leaderboards?: Leaderboard[] | null;
  name?: null | string;
  players?: EventPlayer[] | null;
  playlistId?: number;
}

/**
 * ClanRanking
 */
export interface ClanRanking {
  averageAccuracy?: number;
  averageRank?: number;
  clan?: Clan;
  clanId?: number | null;
  id?: number;
  lastUpdateTime?: number;
  leaderboard?: Leaderboard;
  leaderboardId?: null | string;
  pp?: number;
  rank?: number;
  totalScore?: number;
}

/**
 * ClanUpdate
 */
export interface ClanUpdate {
  changeDescription?: null | string;
  clan?: Clan;
  id?: number;
  player?: Player;
  timeset?: number;
}

/**
 * GlobalMapHistory
 */
export interface GlobalMapHistory {
  clan?: Clan;
  clanId?: number;
  globalMapCaptured?: number;
  id?: number;
  timestamp?: number;
}

/**
 * FeaturedPlaylist
 */
export interface FeaturedPlaylist {
  clans?: Clan[] | null;
  cover?: null | string;
  description?: null | string;
  id?: number;
  leaderboards?: Leaderboard[] | null;
  owner?: null | string;
  ownerCover?: null | string;
  ownerLink?: null | string;
  playlistLink?: null | string;
  title?: null | string;
}

/**
 * ReeSabersReaction
 */
export interface ReeSabersReaction {
  author?: Player;
  authorId?: null | string;
  id?: number;
  reaction?: number;
  timeset?: number;
}

/**
 * ReeSabersComment
 */
export interface ReeSabersComment {
  edited?: boolean;
  editTimeset?: number;
  id?: number;
  player?: Player;
  playerId?: null | string;
  reactions?: ReeSabersReaction[] | null;
  timeset?: number;
  value?: null | string;
}

/**
 * ReeSabersPreset
 */
export interface ReeSabersPreset {
  comments?: ReeSabersComment[] | null;
  commentsCount?: number;
  commentsDisabled?: boolean;
  coverLink?: null | string;
  description?: null | string;
  downloadsCount?: number;
  id?: number;
  jsonLinks?: null | string;
  name?: null | string;
  owner?: Player;
  ownerId?: null | string;
  pcDownloadsCount?: number;
  questDownloadsCount?: number;
  reactions?: ReeSabersReaction[] | null;
  reactionsCount?: number;
  remix?: ReeSabersPreset;
  remixes?: ReeSabersPreset[] | null;
  remixId?: number | null;
  tags?: number;
  textureLinks?: null | string;
  timeposted?: number;
  timeupdated?: number;
  version?: null | string;
}

/**
 * ClanManager
 */
export interface ClanManager {
  clan?: Clan;
  clanId?: number | null;
  id?: number;
  permissions?: number;
  player?: Player;
  playerId?: null | string;
}

/**
 * PlayerFriends
 */
export interface PlayerFriends {
  friends?: Player[] | null;
  id?: null | string;
}

/**
 * PlayerContextExtension
 */
export interface PlayerContextExtension {
  accPp?: number;
  banned?: boolean;
  context?: number;
  country?: null | string;
  countryRank?: number;
  id?: number;
  lastWeekCountryRank?: number;
  lastWeekPp?: number;
  lastWeekRank?: number;
  name?: null | string;
  passPp?: number;
  player?: Player;
  playerId?: null | string;
  pp?: number;
  rank?: number;
  scoreStats?: PlayerScoreStats;
  techPp?: number;
}

/**
 * AchievementDescription
 */
export interface AchievementDescription {
  achievements?: Achievement[] | null;
  description?: null | string;
  id?: number;
  levels?: AchievementLevel[] | null;
  link?: null | string;
  name?: null | string;
}

/**
 * Achievement
 */
export interface Achievement {
  achievementDescription?: AchievementDescription;
  achievementDescriptionId?: number;
  count?: number;
  id?: number;
  level?: AchievementLevel;
  player?: Player;
  playerId?: null | string;
  timeset?: number;
}

/**
 * Player
 */
export interface Player {
  accPp?: number;
  achievements?: Achievement[] | null;
  avatar?: null | string;
  badges?: Badge[] | null;
  banned?: boolean;
  bot?: boolean;
  changes?: PlayerChange[] | null;
  clanOrder?: null | string;
  clans?: Clan[] | null;
  contextExtensions?: PlayerContextExtension[] | null;
  country?: null | string;
  countryRank?: number;
  eventsParticipating?: EventPlayer[] | null;
  externalProfileUrl?: null | string;
  friends?: PlayerFriends[] | null;
  history?: PlayerScoreStatsHistory[] | null;
  id?: null | string;
  inactive?: boolean;
  lastWeekCountryRank?: number;
  lastWeekPp?: number;
  lastWeekRank?: number;
  managingClans?: ClanManager[] | null;
  mapperId?: number;
  name?: null | string;
  passPp?: number;
  patreonFeatures?: PatreonFeatures;
  platform?: null | string;
  pp?: number;
  presets?: ReeSabersPreset[] | null;
  profileSettings?: ProfileSettings;
  rank?: number;
  role?: null | string;
  scoreStats?: PlayerScoreStats;
  scoreStatsId?: number | null;
  socials?: PlayerSocial[] | null;
  techPp?: number;
}

/**
 * User
 */
export interface User {
  bannedClans?: Clan[] | null;
  clanRequest?: Clan[] | null;
  id?: null | string;
  player?: Player;
  playlists?: Playlist[] | null;
}

/**
 * Clan
 */
export interface Clan {
  averageAccuracy?: number;
  averageRank?: number;
  banned?: User[] | null;
  bio?: null | string;
  capturedLeaderboards?: Leaderboard[] | null;
  captureLeaderboardsCount?: number;
  color?: null | string;
  description?: null | string;
  featuredPlaylists?: FeaturedPlaylist[] | null;
  globalMapX?: number;
  globalMapY?: number;
  history?: GlobalMapHistory[] | null;
  icon?: null | string;
  id?: number;
  leaderID?: null | string;
  managers?: ClanManager[] | null;
  name?: null | string;
  players?: Player[] | null;
  playersCount?: number;
  pp?: number;
  rank?: number;
  rankedPoolPercentCaptured?: number;
  requests?: User[] | null;
  tag?: null | string;
  updates?: ClanUpdate[] | null;
}

/**
 * Leaderboard
 */
export interface Leaderboard {
  capturedTime?: number | null;
  changes?: LeaderboardChange[] | null;
  clan?: Clan;
  clanId?: number | null;
  clanRanking?: ClanRanking[] | null;
  clanRankingContested?: boolean;
  contextExtensions?: ScoreContextExtension[] | null;
  difficulty?: DifficultyDescription;
  events?: EventRanking[] | null;
  featuredPlaylists?: FeaturedPlaylist[] | null;
  id?: null | string;
  leaderboardGroup?: LeaderboardGroup;
  negativeVotes?: number;
  playCount?: number;
  playerStats?: PlayerLeaderboardStats[] | null;
  plays?: number;
  positiveVotes?: number;
  qualification?: RankQualification;
  reweight?: RankUpdate;
  scores?: ScoreElement[] | null;
  song?: Song;
  songId?: null | string;
  starVotes?: number;
  timestamp?: number;
  voteStars?: number;
}

/**
 * ScoreContextExtension
 */
export interface ScoreContextExtension {
  accPP?: number;
  accuracy?: number;
  banned?: boolean;
  baseScore?: number;
  bonusPp?: number;
  context?: number;
  id?: number;
  leaderboard?: Leaderboard;
  leaderboardId?: null | string;
  modifiedScore?: number;
  modifiers?: null | string;
  passPP?: number;
  player?: Player;
  playerId?: null | string;
  pp?: number;
  priority?: number;
  qualification?: boolean;
  rank?: number;
  score?: ScoreElement;
  scoreId?: number | null;
  scoreImprovement?: ScoreImprovement;
  techPP?: number;
  timeset?: number;
  weight?: number;
}

/**
 * ScoreMetadata
 */
export interface ScoreMetadata {
  description?: null | string;
  id?: number;
  link?: null | string;
  linkService?: null | string;
  linkServiceIcon?: null | string;
  pinnedContexts?: number;
  priority?: number;
}

/**
 * RankVoting
 */
export interface RankVoting {
  diff?: null | string;
  feedbacks?: VoterFeedback[] | null;
  hash?: null | string;
  mode?: null | string;
  playerId?: null | string;
  rankability?: number;
  scoreId?: number;
  stars?: number;
  timeset?: number;
  type?: number;
}

/**
 * VoterFeedback
 */
export interface VoterFeedback {
  id?: number;
  rtMember?: null | string;
  value?: number;
}

/**
 * ReplayOffsets
 */
export interface ReplayOffsets {
  frames?: number;
  heights?: number;
  id?: number;
  notes?: number;
  pauses?: number;
  walls?: number;
}

/**
 * ScoreImprovement
 */
export interface ScoreImprovement {
  accLeft?: number;
  accRight?: number;
  accuracy?: number;
  averageRankedAccuracy?: number;
  badCuts?: number;
  bombCuts?: number;
  bonusPp?: number;
  id?: number;
  missedNotes?: number;
  pauses?: number;
  pp?: number;
  rank?: number;
  score?: number;
  timeset?: null | string;
  totalPp?: number;
  totalRank?: number;
  wallsHit?: number;
}

/**
 * EventPlayer
 */
export interface EventPlayer {
  country?: null | string;
  countryRank?: number;
  eventId?: number;
  id?: number;
  name?: null | string;
  playerId?: null | string;
  pp?: number;
  rank?: number;
}

/**
 * PlayerScoreStats
 */
export interface PlayerScoreStats {
  anonimusReplayWatched?: number;
  aPlays?: number;
  authorizedReplayWatched?: number;
  averageAccuracy?: number;
  averageLeftTiming?: number;
  averageRank?: number;
  averageRankedAccuracy?: number;
  averageRankedRank?: number;
  averageRightTiming?: number;
  averageUnrankedAccuracy?: number;
  averageUnrankedRank?: number;
  averageWeightedRankedAccuracy?: number;
  averageWeightedRankedRank?: number;
  countryTopPercentile?: number;
  dailyImprovements?: number;
  id?: number;
  lastRankedScoreTime?: number;
  lastScoreTime?: number;
  lastUnrankedScoreTime?: number;
  maxStreak?: number;
  medianAccuracy?: number;
  medianRankedAccuracy?: number;
  peakRank?: number;
  rankedImprovementsCount?: number;
  rankedMaxStreak?: number;
  rankedPlayCount?: number;
  rankedTop1Count?: number;
  rankedTop1Score?: number;
  sPlays?: number;
  spPlays?: number;
  ssPlays?: number;
  sspPlays?: number;
  top1Count?: number;
  top1Score?: number;
  topAccPP?: number;
  topAccuracy?: number;
  topBonusPP?: number;
  topHMD?: number;
  topPassPP?: number;
  topPercentile?: number;
  topPlatform?: null | string;
  topPp?: number;
  topRankedAccuracy?: number;
  topTechPP?: number;
  topUnrankedAccuracy?: number;
  totalImprovementsCount?: number;
  totalPlayCount?: number;
  totalRankedScore?: number;
  totalScore?: number;
  totalUnrankedScore?: number;
  unrankedImprovementsCount?: number;
  unrankedMaxStreak?: number;
  unrankedPlayCount?: number;
  unrankedTop1Count?: number;
  unrankedTop1Score?: number;
  watchedReplays?: number;
}

/**
 * AchievementLevel
 */
export interface AchievementLevel {
  achievementDescriptionId?: number;
  color?: null | string;
  description?: null | string;
  detailedDescription?: null | string;
  id?: number;
  image?: null | string;
  level?: number;
  name?: null | string;
  smallImage?: null | string;
  value?: number | null;
}

/**
 * Badge
 */
export interface Badge {
  description?: null | string;
  hidden?: boolean;
  id?: number;
  image?: null | string;
  link?: null | string;
  timeset?: number;
}

/**
 * PlayerChange
 */
export interface PlayerChange {
  changer?: null | string;
  id?: number;
  newCountry?: null | string;
  newName?: null | string;
  oldCountry?: null | string;
  oldName?: null | string;
  playerId?: null | string;
  timestamp?: number;
}

/**
 * PlayerScoreStatsHistory
 */
export interface PlayerScoreStatsHistory {
  aPlays?: number;
  averageAccuracy?: number;
  averageLeftTiming?: number;
  averageRank?: number;
  averageRankedAccuracy?: number;
  averageRankedRank?: number;
  averageRightTiming?: number;
  averageUnrankedAccuracy?: number;
  averageUnrankedRank?: number;
  averageWeightedRankedAccuracy?: number;
  averageWeightedRankedRank?: number;
  context?: number;
  countryRank?: number;
  dailyImprovements?: number;
  id?: number;
  lastRankedScoreTime?: number;
  lastScoreTime?: number;
  lastUnrankedScoreTime?: number;
  maxStreak?: number;
  medianAccuracy?: number;
  medianRankedAccuracy?: number;
  peakRank?: number;
  playerId?: null | string;
  pp?: number;
  rank?: number;
  rankedImprovementsCount?: number;
  rankedPlayCount?: number;
  replaysWatched?: number;
  sPlays?: number;
  spPlays?: number;
  ssPlays?: number;
  sspPlays?: number;
  timestamp?: number;
  topAccuracy?: number;
  topBonusPP?: number;
  topHMD?: number;
  topPlatform?: null | string;
  topPp?: number;
  topRankedAccuracy?: number;
  topUnrankedAccuracy?: number;
  totalImprovementsCount?: number;
  totalPlayCount?: number;
  totalRankedScore?: number;
  totalScore?: number;
  totalUnrankedScore?: number;
  unrankedImprovementsCount?: number;
  unrankedPlayCount?: number;
  watchedReplays?: number;
}

/**
 * PatreonFeatures
 */
export interface PatreonFeatures {
  bio?: null | string;
  id?: number;
  leftSaberColor?: null | string;
  message?: null | string;
  rightSaberColor?: null | string;
}

/**
 * ProfileSettings
 */
export interface ProfileSettings {
  bio?: null | string;
  effectName?: null | string;
  hue?: number | null;
  id?: number;
  leftSaberColor?: null | string;
  message?: null | string;
  profileAppearance?: null | string;
  profileCover?: null | string;
  rightSaberColor?: null | string;
  saturation?: number | null;
  showAllRatings?: boolean;
  showBots?: boolean;
  starredFriends?: null | string;
}

/**
 * PlayerSocial
 */
export interface PlayerSocial {
  id?: number;
  link?: null | string;
  playerId?: null | string;
  service?: null | string;
  user?: null | string;
  userId?: null | string;
}

/**
 * Playlist
 */
export interface Playlist {
  deleted?: boolean;
  guid?: string;
  hash?: null | string;
  id?: number;
  isShared?: boolean;
  link?: null | string;
  ownerId?: null | string;
}

/**
 * LeaderboardChange
 */
export interface LeaderboardChange {
  id?: number;
  newAccRating?: number;
  newCriteriaMet?: number;
  newModifiers?: ModifiersMap;
  newModifiersRating?: ModifiersRating;
  newPassRating?: number;
  newRankability?: number;
  newStars?: number;
  newTechRating?: number;
  newType?: number;
  oldAccRating?: number;
  oldCriteriaMet?: number;
  oldModifiers?: ModifiersMap;
  oldModifiersRating?: ModifiersRating;
  oldPassRating?: number;
  oldRankability?: number;
  oldStars?: number;
  oldTechRating?: number;
  oldType?: number;
  playerId?: null | string;
  timeset?: number;
}

/**
 * ModifiersMap
 */
export interface ModifiersMap {
  da?: number;
  fs?: number;
  gn?: number;
  modifierId?: number;
  na?: number;
  nb?: number;
  nf?: number;
  no?: number;
  op?: number;
  pm?: number;
  sa?: number;
  sc?: number;
  sf?: number;
  ss?: number;
}

/**
 * ModifiersRating
 */
export interface ModifiersRating {
  fsAccRating?: number;
  fsPassRating?: number;
  fsPredictedAcc?: number;
  fsStars?: number;
  fsTechRating?: number;
  id?: number;
  sfAccRating?: number;
  sfPassRating?: number;
  sfPredictedAcc?: number;
  sfStars?: number;
  sfTechRating?: number;
  ssAccRating?: number;
  ssPassRating?: number;
  ssPredictedAcc?: number;
  ssStars?: number;
  ssTechRating?: number;
}

/**
 * DifficultyDescription
 */
export interface DifficultyDescription {
  accRating?: number | null;
  bombs?: number;
  difficultyName?: null | string;
  duration?: number;
  id?: number;
  maxScore?: number;
  mode?: number;
  modeName?: null | string;
  modifiersRating?: ModifiersRating;
  modifierValues?: ModifiersMap;
  njs?: number;
  nominatedTime?: number;
  notes?: number;
  nps?: number;
  passRating?: number | null;
  predictedAcc?: number | null;
  qualifiedTime?: number;
  rankedTime?: number;
  requirements?: number;
  stars?: number | null;
  status?: number;
  techRating?: number | null;
  type?: number;
  value?: number;
  walls?: number;
}

/**
 * QualificationVote
 */
export interface QualificationVote {
  discordRTMessageId?: null | string;
  edited?: boolean;
  editTimeset?: number | null;
  id?: number;
  playerId?: null | string;
  rankQualification?: RankQualification;
  rankQualificationId?: number | null;
  timeset?: number;
  value?: number;
}

/**
 * CriteriaCommentary
 */
export interface CriteriaCommentary {
  discordMessageId?: null | string;
  edited?: boolean;
  editTimeset?: number | null;
  id?: number;
  playerId?: null | string;
  rankQualification?: RankQualification;
  rankQualificationId?: number | null;
  timeset?: number;
  value?: null | string;
}

/**
 * QualificationCommentary
 */
export interface QualificationCommentary {
  discordMessageId?: null | string;
  edited?: boolean;
  editTimeset?: number | null;
  id?: number;
  playerId?: null | string;
  rankQualification?: RankQualification;
  rankQualificationId?: number | null;
  timeset?: number;
  value?: null | string;
}

/**
 * RankQualification
 */
export interface RankQualification {
  approvalTimeset?: number;
  approved?: boolean;
  approvers?: null | string;
  changes?: QualificationChange[] | null;
  comments?: QualificationCommentary[] | null;
  criteriaCheck?: null | string;
  criteriaChecker?: null | string;
  criteriaCommentary?: null | string;
  criteriaComments?: CriteriaCommentary[] | null;
  criteriaMet?: number;
  criteriaTimeset?: number;
  discordChannelId?: null | string;
  discordRTChannelId?: null | string;
  id?: number;
  mapperAllowed?: boolean;
  mapperId?: null | string;
  mapperQualification?: boolean;
  modifiers?: ModifiersMap;
  modifiersRating?: ModifiersRating;
  qualityVote?: number;
  rtMember?: null | string;
  timeset?: number;
  votes?: QualificationVote[] | null;
}

/**
 * QualificationChange
 */
export interface QualificationChange {
  id?: number;
  newAccRating?: number;
  newCriteriaCommentary?: null | string;
  newCriteriaMet?: number;
  newModifiers?: ModifiersMap;
  newPassRating?: number;
  newRankability?: number;
  newStars?: number;
  newTechRating?: number;
  newType?: number;
  oldAccRating?: number;
  oldCriteriaCommentary?: null | string;
  oldCriteriaMet?: number;
  oldModifiers?: ModifiersMap;
  oldPassRating?: number;
  oldRankability?: number;
  oldStars?: number;
  oldTechRating?: number;
  oldType?: number;
  playerId?: null | string;
  timeset?: number;
}

/**
 * RankUpdate
 */
export interface RankUpdate {
  changes?: RankUpdateChange[] | null;
  criteriaCommentary?: null | string;
  criteriaMet?: number;
  finished?: boolean;
  id?: number;
  keep?: boolean;
  modifiers?: ModifiersMap;
  modifiersRating?: ModifiersRating;
  passRating?: number;
  predictedAcc?: number;
  rtMember?: null | string;
  stars?: number;
  techRating?: number;
  timeset?: number;
  type?: number;
}

/**
 * RankUpdateChange
 */
export interface RankUpdateChange {
  id?: number;
  newCriteriaCommentary?: null | string;
  newCriteriaMet?: number;
  newKeep?: boolean;
  newModifiers?: ModifiersMap;
  newStars?: number;
  newType?: number;
  oldCriteriaCommentary?: null | string;
  oldCriteriaMet?: number;
  oldKeep?: boolean;
  oldModifiers?: ModifiersMap;
  oldStars?: number;
  oldType?: number;
  playerId?: null | string;
  timeset?: number;
}

/**
 * Song
 */
export interface Song {
  author?: null | string;
  bpm?: number;
  collaboratorIds?: null | string;
  coverImage?: null | string;
  difficulties?: DifficultyDescription[] | null;
  downloadUrl?: null | string;
  duration?: number;
  externalStatuses?: ExternalStatus[] | null;
  fullCoverImage?: null | string;
  hash?: null | string;
  id?: null | string;
  mapper?: null | string;
  mapperId?: number;
  name?: null | string;
  subName?: null | string;
  tags?: null | string;
  uploadTime?: number;
}

/**
 * ExternalStatus
 */
export interface ExternalStatus {
  details?: null | string;
  id?: number;
  link?: null | string;
  responsible?: null | string;
  status?: number;
  timeset?: number;
  title?: null | string;
  titleColor?: null | string;
}
