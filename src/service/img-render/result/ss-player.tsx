/** @jsxImportSource react */
import Flags, { EarchIcon } from '../components/flag'
import { twJoin } from '../utils/tw-join'
import ScoreItem from '../components/ssScoreItem'
import { ScoreSaberItem, ScoreSaberUser } from '../interfaces'

interface SSPlayerProps {
  leaderItems: ScoreSaberItem[]
  scoreUser: ScoreSaberUser
  params?: Record<string, string>
}

export default function SSPlayerPage({
  leaderItems,
  scoreUser,
  params,
}: SSPlayerProps) {
  const bg = 'https://www.loliapi.com/acg/pc/'
  return (
    <>
      <div
        className={
          'flex flex-col justify-center items-center relative h-[720px] w-[1024px] my-auto'
        }
        id="render-result"
      >
        <div
          className={
            'bg-blend-darken h-full w-full left-auto absolute right-auto bg-black/[.6] p-4 text-white rounded-lg flex flex-col space-y-2 z-10'
          }
        >
          <div className={'flex space-x-4 pb-2'}>
            <img
              className={'h-32 w-32 rounded-md'}
              src={scoreUser.profilePicture}
              loading={'eager'}
              // fallback={scoreUser.name.slice(0, 1)}
            />
            <div className={'flex flex-col justify-between'}>
              <span className={'text-3xl font-bold'}>{scoreUser.name}</span>
              <div className={'flex space-x-2 text-md font-bold items-center'}>
                <span className="flex items-center space-x-1">
                  <EarchIcon />
                  <span># {scoreUser.rank}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Flags flagNationCode={scoreUser.country} />
                  <span># {scoreUser.countryRank}</span>
                </span>
              </div>
              <div
                className={twJoin(
                  'text-4xl font-bold ',
                  ' bg-gradient-to-r bg-clip-text text-transparent from-blue-300 to-red-300',
                  'text-orange-100'
                )}
              >
                {scoreUser.pp.toFixed(3)} PP
              </div>
            </div>
            <div
              className={
                'text-4xl pl-40 items-center flex text-gray-100 opacity-70'
              }
            >
              <span>coming soon 👷</span>
            </div>
          </div>
          <div className={'grid grid-cols-4 gap-2'}>
            {leaderItems.map((item, idx) => (
              <ScoreItem scoreItem={item} key={idx} />
            ))}
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
