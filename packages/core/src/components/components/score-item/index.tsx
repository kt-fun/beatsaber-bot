import { BarChart, Key, Pin, Star, Wrench } from 'lucide-react'
import React from 'react'
import { FullComboBadge } from './badges/fc'



export interface ScoreItemProps {
  mapId: string
  /** map name */
  name: string
  /** map cover url */
  cover: string
  /** difficulty in short, eg: E, N, H, EX, EX+ */
  difficulty: string
  /** map rank level in string format, eg: 8.43, 9.41, none */
  star: string,
  /** accuracy percentage in string eg: 98.3% */
  acc: string
  /** pp score in string, eg: 359.34pp */
  pp: string
  /** relative time from now to score uploaded time in humanized format, eg: 3min, 32d, 3y3d */
  relativeTime: string
  /** modifiers in score */
  modifiers: string[]
  /** badges, eg: full combo, pinned, top1, top10, top100 */
  badges: string[]
}

const badgeMap = {
  fc: <FullComboBadge/>,
  pinned: <Pin className="rotate-45 size-4 my-auto" />
}

export default function ScoreItem({
  name,
  cover,
  difficulty,
  star,
  mapId,
  acc,
  pp,
  relativeTime,
  modifiers,
  badges,
}: ScoreItemProps) {
  return (
    <div className="relative overflow-hidden backdrop-blur-none rounded-lg text-white bg-black/[.3]">
      <div className={'flex space-x-2'}>
        <img loading={'eager'} src={cover} className={'rounded-md h-20 w-20'} alt={'score item cover'}/>
        <div className={'flex flex-col space-y-1 py-0.5'}>
          <div className={'font-semibold text-xs text-ellipsis overflow-hidden line-clamp-1 break-all'}>{name}</div>
          <div className={'text-xs flex items-center space-x-2 *:flex *:items-center *:space-x-1'}>
            <div><span><BarChart className={'w-3 h-3'} /></span><span>{difficulty}</span></div>
            <div><span><Star className={'w-3 h-3'} /></span><span>{star ?? "none"}</span></div>
            <div><span><Key className={'w-3 h-3'} /></span><span>{mapId}</span></div>
          </div>
          <div className={'flex space-x-2 text-xs items-center'}>
            <span>{acc}</span>
            <span className={'text-orange-200'}>{pp}</span>
            <span className={'text-xs opacity-70'}>{relativeTime}</span>
          </div>
          <div className={'flex items-center space-x-2'}>
            {modifiers.length > 0 && (
              <div className="text-xs flex flex-wrap space-x-2 items-center">
                <Wrench className="h-3 w-3" />
                {modifiers.map((modifier) => <span key={modifier}>{modifier}</span>)}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="absolute right-1 bottom-1 text-white flex text-xs space-x-1 items-center">
        { badges.map(badge => <div className={'size-4'} key={badge}>{badgeMap[badge]}</div>) }
      </div>
    </div>
  )
}

export * from './bl'
export * from './ss'
