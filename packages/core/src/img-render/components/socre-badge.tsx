/** @jsxImportSource react */
import { twJoin } from '../utils/tw-join'

export default function ScoreBadge({
  name,
  count,
  className,
}: {
  name: string
  count: string | number
  className?: string
}) {
  return (
    <>
      <div
        className={twJoin(
          'flex items-center self-center  rounded-md  w-18',
          'bg-gradient-to-r bg-clip-text text-transparent from-blue-300 to-red-300',
          className
        )}
      >
        <span className="border-r-0.5 font-semibold m-auto text-center rounded-l-lg w-8">
          {name}
        </span>
        <span className="bg-transparent m-auto text-ellipsis line-clamp-1">
          {count}
        </span>
      </div>
    </>
  )
}
