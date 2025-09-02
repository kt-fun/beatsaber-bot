import {twJoin} from "@/components/utils/tw-join";

export function FullComboBadge({ className }: {className?: string}) {
  return (
    <span className={twJoin("from-blue-300 to-red-300 bg-gradient-to-r bg-clip-text text-transparent", className)}>
      FC
    </span>
  )
}
