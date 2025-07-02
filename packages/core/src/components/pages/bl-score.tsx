/** @jsxImportSource react */
import {
  BarChart,
  Check,
  Key,
  Star,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Calendar,
} from 'lucide-react'
import { diffConv, formatDuration, formatTime } from '../utils'
import Progressbar from '../components/progressbar'
import ScoreGraph from '../components/scoregraph'
import React from 'react'
import { BSOR, Score } from '@/service/api/interfaces/beatleader'
import { BSMap } from '@/service/api/interfaces/beatsaver'

interface BLScoreProps {
  score: Score
  bsMap: BSMap
  statistic: any
  bsor: BSOR
  qrcodeUrl: string
}

export function BLScore({
  score,
  bsMap,
  statistic,
  bsor,
  qrcodeUrl,
}: BLScoreProps) {
  const bg = 'https://www.loliapi.com/acg/pc/'
  return (
    <>
      <div
        className={
          'flex flex-col justify-center items-center relative h-[720px] w-[400px] my-auto rounded-none'
        }
        id="render-result"
      >
        <div
          className={
            'bg-blend-darken h-full w-full left-auto absolute right-auto bg-black/[.6] p-4 text-white flex flex-col justify-between z-10'
          }
        >
          <div className="flex space-x-4 items-center justify-between text-xl font-bold">
            <div className="flex space-x-4 items-center justify-between text-2xl font-bold">
              <img
                loading={'eager'}
                className={'h-16 w-16 rounded-full'}
                src={score.player.avatar}
                // fallback={score.player.name.slice(0, 1)}
              />
              <div>{score.player.name}</div>
            </div>
            <div
              className={'w-[100px] flex items-center justify-center flex-col'}
            >
              <img
                src={qrcodeUrl}
                width={80}
                height={80}
                className={'w-[80px] aspect-square'}
              />
              <span className={'text-xs'}>replay</span>
            </div>
          </div>
          <div className="flex space-x-4 h-40">
            <img
              className={'h-40 w-40 rounded-md'}
              src={score.song.cover}
              // fallback={score.song.name.slice(0, 1)}
            />
            <div className="text-xs font-bold flex flex-col justify-between">
              <div className="text-xl text-ellipsis line-clamp-2">
                {score.song.name}
              </div>
              <div className="flex space-x-2 items-center text-sm">
                <img
                  className={'h-4 w-4 rounded-full'}
                  src={bsMap.uploader.avatar}
                  // fallback={score.song.mapper.slice(0, 1)}
                />
                <div className="flex items-center justify-between">
                  <div className="text-ellipsis line-clamp-1">
                    {score.song.mapper}
                  </div>
                </div>
              </div>
              <div className="text-xs grid grid-cols-3 gap-1 *:space-x-1 *:flex *:items-center font-normal">
                <div className="flex items-center text-ellipsis col-span-3 line-clamp-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatTime(bsMap.lastPublishedAt)}</span>
                </div>
                <div>
                  <span>
                    <BarChart className={'w-3 h-3'} />
                  </span>
                  <span>{diffConv(score.difficulty.difficultyName)}</span>
                </div>
                <div>
                  <span>
                    <Star className={'w-3 h-3'} />
                  </span>
                  <span>{score.difficulty.stars?.toFixed(2) ?? 'none'} </span>
                </div>
                <div>
                  <span>
                    <Key className={'w-3 h-3'} />
                  </span>
                  <span>{score.song.id.toLowerCase().replaceAll('x', '')}</span>
                </div>

                <div className="flex items-center">
                  <ThumbsUp className="h-3 w-3" />
                  <span>{bsMap.stats.upvotes}</span>
                </div>
                <div className="flex items-center">
                  <ThumbsDown className="h-3 w-3" />
                  <span>{bsMap.stats.downvotes}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-3 w-3" />
                  <span>{formatDuration(bsMap.metadata.duration)}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-xs font-normal">
                <Progressbar value={bsMap.stats.score * 100} />
                <span>{(bsMap.stats.score * 100).toFixed(2)} %</span>
              </div>
            </div>
          </div>
          <div className="text-xl font-bold pt-2">
            <div className="flex justify-between">
              <span> # {score.rank}</span>
              <span>{score.pp.toFixed(2)} PP</span>
            </div>
            {
              <div className="flex items-center justify-between">
                <span>Accuracy</span>
                <span>{(score.accuracy * 100).toFixed(2)} %</span>
              </div>
            }
            {score.fullCombo && (
              <div className="flex items-center justify-between">
                <span>Full Combo</span>
                <Check />
              </div>
            )}
            {score.maxCombo && (
              <div className="flex items-center justify-between">
                <span>Max Combo</span>
                <span>{score.maxCombo}</span>
              </div>
            )}
            {
              <div className="flex items-center justify-between">
                <span>Missed Notes</span>
                <span>{score.missedNotes}</span>
              </div>
            }
            {
              <div className="flex items-center justify-between">
                <span>Total Mistakes</span>
                <span>{score.missedNotes}</span>
              </div>
            }
            {score.modifiers && (
              <div className="flex items-center justify-between">
                <span>Modifiers</span>
                <span>{score.modifiers}</span>
              </div>
            )}
          </div>
          <div className="align-end mt-auto mb-2">
            <span className="text-xl font-bold">AccGraph</span>
            <ScoreGraph
              scoreId={score.id}
              scoreInfo={score}
              statistic={statistic}
              bsor={bsor}
              height={192}
              width={400}
            />
          </div>
        </div>

        <img
          src={bg}
          className={'inset-0 rounded-lg absolute h-full object-cover'}
          loading={'eager'}
        />
      </div>
    </>
  )
}
