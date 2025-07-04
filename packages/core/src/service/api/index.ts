import {AIOSaberClient, BeatLeaderClient, BeatSaverClient, ScoreSaberClient} from "./base";
import {Config} from "@/config";
import {Logger} from "@/interface";
import {BLIDNotFoundError, MapIdNotFoundError, SSIDNotFoundError} from "@/infra/errors";
import {BSMap, HashResponse} from "./interfaces/beatsaver";
import {ScoreSaberItem} from "./interfaces/scoresaber";
import {Leaderboard} from "./interfaces/beatleader";
import {NotFoundError} from "@/infra/support/fetch/error";
import {sortScore} from "./sortScore";
import {decode} from "@/components/utils/bl/bsorDecoder";

type MapDiffOption = {
  difficulty?: string
  mode?: string
}


export class APIService {
  BeatLeader: BeatLeaderClient
  ScoreSaber: ScoreSaberClient
  BeatSaver: BeatSaverClient
  AIOSaber: AIOSaberClient
  constructor(cfg: Config, logger: Logger) {
    this.BeatSaver = new BeatSaverClient({
      logger,
      host: cfg.beatsaver.host,
      client_id: cfg.beatsaver.oauthClientId,
      client_secret: cfg.beatsaver.oauthClientSecret
    })
    this.BeatLeader = new BeatLeaderClient({
      logger,
      client_id: cfg.beatleader.oauthClientId,
      client_secret: cfg.beatleader.oauthClientSecret
    })
    this.ScoreSaber = new ScoreSaberClient(logger)
    this.AIOSaber = new AIOSaberClient(logger)
  }
  async getBLPlayerScoresWithUserInfo(accountId: string) {
    const [userInfo, playerScores, pinnedScores] = await Promise.all([
      this.BeatLeader.getPlayerInfo(accountId),
      this.BeatLeader.getPlayerScores(accountId),
      this.BeatLeader.getPlayerPinnedScores(accountId),
    ])
    if (!(userInfo && playerScores)) {
      throw new BLIDNotFoundError({ accountId })
    }
    const filteredScores = playerScores.data.filter(
      (item) => !pinnedScores.some((pinned) => pinned.id === item.id)
    )
    const scores = pinnedScores.concat(filteredScores).slice(0, 24)
    return {
      scores: scores,
      userInfo: userInfo,
    }
  }
  async getSSPlayerScoresWithUserInfo(accountId: string) {

  }
  async getScoreByPlayerIdAndMapId(
    playerId: string,
    mapId: string,
    option?: MapDiffOption
  ): Promise<Leaderboard> {
    const map = await this.BeatSaver.searchMapById(mapId)
    if (!map) {
      throw new MapIdNotFoundError()
    }
    const hash = map.versions[0].hash
    let reqs = map.versions[0].diffs.map((it) => ({
      diff: it.difficulty,
      mode: it.characteristic,
      hash: hash,
      playerID: playerId,
      leaderboardContext: 'general',
    }))
    if (option && option.difficulty) {
      reqs = reqs.filter((item) => item.diff == option.difficulty)
    }
    if (option && option.mode) {
      reqs = reqs.filter((item) => item.mode == option.mode)
    }
    const res = await Promise.allSettled(reqs.map(
      (it) => this.BeatLeader.getPlayerScore(it)))
    const scores = res
      .filter((item) => item.status === 'fulfilled')
      .map(<T>(it: PromiseFulfilledResult<T>) => it.value)
    if (scores.length < 1) {
      throw new NotFoundError()
    }
    scores.sort(sortScore)
    return scores[0]
  }

  async getAroundScoreAndRegionScoreByRankAndPage(
    leaderboardId: string,
    rank: number,
    regionCode: string
  ) {
    const page = Math.ceil(rank / 10)
    const rest = rank % 10
    let startIndex = 0
    if (rest > 7) {
      startIndex = 2
    }
    const [regionScore, aroundScore] = await Promise.all([
      this.BeatLeader.getLeaderboard(leaderboardId, {
        leaderboardContext: 'general',
        page: 1,
        sortBy: 'rank',
        order: 'desc',
        countries: regionCode,
      }),
      this.BeatLeader.getLeaderboard(leaderboardId, {
        leaderboardContext: 'general',
        page: page,
        sortBy: 'rank',
        order: 'desc',
      }),
    ])
    const difficulties = regionScore.song.difficulties
    return {
      difficulties: difficulties,
      aroundScores: aroundScore.scores.slice(startIndex, startIndex + 7),
      regionTopScores: regionScore.scores,
    }
  }
  async getScoreAndBSMapByScoreId(scoreId: string) {
    const res = await this.BeatLeader.getBeatScore(scoreId)
    const bsorLink = res.replay
    const bsorContent = await fetch(bsorLink)
    const bsor = await new Promise((resolve, reject) => {
      bsorContent.arrayBuffer().then((res) => decode(res, resolve))
      setTimeout(() => reject('timeout exceed'), 5000)
    })
    const statistic = await fetch(
      `https://cdn.scorestats.beatleader.xyz/${scoreId}.json`
    ).then((res) => res.json())
    const id = res.song.id.split('x')?.[0]
    const bsMap = await this.BeatSaver.searchMapById(id)
    return {
      score: res,
      bsMap: bsMap,
      statistic: statistic,
      bsor: bsor,
    }
  }
  async getSSPlayerRecentScoreWithUserInfo(uid: string) {
    const [userInfo, scores] = await Promise.all([
      this.ScoreSaber.getScoreUserById(uid),
      this.ScoreSaber.getScoreItemsById(uid, 1, 24)
        .then((res) => res?.playerScores),
    ])
    if (!scores || !userInfo) {
      throw new SSIDNotFoundError({ accountId: uid })
    }
    const hashes = scores.map((it) => it.leaderboard.songHash)

    let hashInfo = await this.BeatSaver.getMapsByHashes(hashes)
    if (hashInfo.id) {
      const map = hashInfo as BSMap
      hashInfo = {} as HashResponse
      hashInfo[map.versions[0].hash] = map
    }
    const res = scores.map(
      (it) =>
        ({
          mapId: (hashInfo as HashResponse)[
            it.leaderboard.songHash.toLowerCase()
            ]?.id,
          ...it,
        }) as ScoreSaberItem
    )
    return {
      scores: res,
      userInfo: userInfo,
    }
  }
}
