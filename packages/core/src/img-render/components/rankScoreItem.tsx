import dayjs from 'dayjs'
import Flags, { EarchIcon } from '@/img-render/components/flag'
import { formatDate, numberWithCommas } from '@/img-render/utils'

interface ScoreItemProps {
  name: string
  avatar: string
  globalRank: number
  countryCode: string
  isRegionRank: boolean
  score: number
  modifiers: string
  acc: number
  pp: number
  date: number
  self: boolean
}
export function RankScoreItem(props: ScoreItemProps) {
  return (
    <div
      className={`bs-bg-gradient shadow-xl rounded-lg -skew-x-12 w-80 h-20 text-white font-bold flex flex-col p-1 z-10 relative max-w-[300px] ${props.self && `gradient-border`} `}
    >
      <div className="skew-x-12 relative">
        <div className="flex items-center translate-x-2 justify-between">
          <div className="flex gap-2">
            <div className={'w-12 h-12 relative'}>
              <img
                src={props.avatar}
                className="shadow-lg w-12 h-12 rounded-full object-cover"
              />
              <div className={'w-3 h-3 absolute bottom-0 right-3'}>
                <Flags flagNationCode={props.countryCode} />
              </div>
            </div>
            <div>
              <div className={'line-clamp-1 text-ellipsis max-w-[100px]'}>
                {props.name}
              </div>
              <span className="flex items-center space-x-1">
                {!props.isRegionRank && <EarchIcon />}
                <span># {props.globalRank}</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end -translate-x-2 -skew-x-3">
            <div>{(props.acc * 100).toFixed(2)} %</div>
            <div className={'flex gap-2'}>
              <div className={'space-x-1'}>
                {' '}
                {props.modifiers.split(',').map((it) => (
                  <span key={it} className={''}>
                    {it}
                  </span>
                ))}{' '}
              </div>
              <div>{numberWithCommas(props.score)}</div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-0 px-4 -translate-x-4">
          <div className="flex gap-2">
            <div className="flex gap-1 items-center justify-start -skew-x-2 text-xs opacity-60">
              <div>
                {formatDate(
                  dayjs(props.date * 1000).toDate(),
                  'YYYY 年 MM 月 DD 日'
                )}
              </div>
            </div>
            {/*<span className="flex items-center space-x-1">*/}
            {/*      */}
            {/*      /!*<span># {props.regionRank}</span>*!/*/}
            {/*    </span>*/}
          </div>
          <div>
            <div className="flex gap-1 items-center justify-start translate-x-6 text-xl font-bold text-green-300">
              <div> {props.pp.toFixed(2)} PP</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
