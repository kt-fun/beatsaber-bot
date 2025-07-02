import { BarChart, Star } from 'lucide-react'
import { diffConv } from '@/components/utils'
import { HTMLProps } from 'react'

export function RankDifficulty({
  difficulty,
  star,
  blStar,
  current,
}: {
  difficulty: string
  star: number | undefined
  blStar: number | undefined
  current: boolean
}) {
  return (
    <div
      className={`p-2 rounded-lg bs-bg-gradient  ${current ? `gradient-border opacity-100` : 'opacity-60'} `}
    >
      <div className={'flex items-center gap-2'}>
        <span>
          <BarChart className={'w-4 h-4'} />
        </span>
        <span>{diffConv(difficulty)}</span>
      </div>
      {star && (
        <div className={'flex items-center gap-2'}>
          <span>
            <SSStar className={'w-4 h-4'} />
          </span>
          <span>{star?.toFixed(2) ?? 'none'} </span>
        </div>
      )}
      {blStar && (
        <div className={'flex items-center gap-2'}>
          <span>
            <BLStar className={'w-4 h-4'} />
          </span>
          <span>{blStar?.toFixed(2) ?? 'none'} </span>
        </div>
      )}
    </div>
  )
}

const BLStar = (props: HTMLProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.6431 7.17815L11.8306 9.60502L12.6875 13.2344C12.7348 13.4314 12.7226 13.638 12.6525 13.8281C12.5824 14.0182 12.4576 14.1833 12.2937 14.3025C12.1299 14.4217 11.9344 14.4896 11.7319 14.4977C11.5295 14.5059 11.3292 14.4538 11.1563 14.3481L8.00002 12.4056L4.8419 14.3481C4.66904 14.4532 4.46896 14.5048 4.26686 14.4963C4.06476 14.4879 3.86966 14.4199 3.70615 14.3008C3.54263 14.1817 3.41801 14.0169 3.34796 13.8272C3.27792 13.6374 3.26559 13.4312 3.31252 13.2344L4.17252 9.60502L1.36002 7.17815C1.20708 7.04596 1.09648 6.87166 1.04201 6.67699C0.987547 6.48232 0.991641 6.27592 1.05378 6.08356C1.11592 5.89121 1.23336 5.72142 1.39142 5.59541C1.54948 5.4694 1.74116 5.39274 1.94252 5.37502L5.63002 5.07752L7.05252 1.63502C7.12952 1.44741 7.26057 1.28693 7.429 1.17398C7.59744 1.06104 7.79566 1.00073 7.99846 1.00073C8.20126 1.00073 8.39948 1.06104 8.56791 1.17398C8.73635 1.28693 8.8674 1.44741 8.9444 1.63502L10.3663 5.07752L14.0538 5.37502C14.2555 5.39208 14.4478 5.46831 14.6064 5.59415C14.765 5.71999 14.883 5.88984 14.9455 6.08243C15.0081 6.27502 15.0124 6.48178 14.9579 6.6768C14.9035 6.87182 14.7927 7.04644 14.6394 7.17877L14.6431 7.17815Z"
        fill="url(#paint0_linear_36_531)"
      />
      <circle cx="8" cy="8" r="2" fill="#D9D9D9" />
      <defs>
        <linearGradient
          id="paint0_linear_36_531"
          x1="3.50006"
          y1="14"
          x2="15.0001"
          y2="1.00003"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#2A79F8" />
          <stop offset="0.5" stopColor="#F41AFF" />
          <stop offset="1" stopColor="#FF0303" />
        </linearGradient>
      </defs>
    </svg>
  )
}

const SSStar = (props: HTMLProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.6431 7.17815L11.8306 9.60502L12.6875 13.2344C12.7348 13.4314 12.7226 13.638 12.6525 13.8281C12.5824 14.0182 12.4576 14.1833 12.2937 14.3025C12.1299 14.4217 11.9344 14.4896 11.7319 14.4977C11.5295 14.5059 11.3292 14.4538 11.1563 14.3481L8.00002 12.4056L4.8419 14.3481C4.66904 14.4532 4.46896 14.5048 4.26686 14.4963C4.06476 14.4879 3.86966 14.4199 3.70615 14.3008C3.54263 14.1817 3.41801 14.0169 3.34796 13.8272C3.27792 13.6374 3.26559 13.4312 3.31252 13.2344L4.17252 9.60502L1.36002 7.17815C1.20708 7.04596 1.09648 6.87166 1.04201 6.67699C0.987547 6.48232 0.991641 6.27592 1.05378 6.08356C1.11592 5.89121 1.23336 5.72142 1.39142 5.59541C1.54948 5.4694 1.74116 5.39274 1.94252 5.37502L5.63002 5.07752L7.05252 1.63502C7.12952 1.44741 7.26057 1.28693 7.429 1.17398C7.59744 1.06104 7.79566 1.00073 7.99846 1.00073C8.20126 1.00073 8.39948 1.06104 8.56791 1.17398C8.73635 1.28693 8.8674 1.44741 8.9444 1.63502L10.3663 5.07752L14.0538 5.37502C14.2555 5.39208 14.4478 5.46831 14.6064 5.59415C14.765 5.71999 14.883 5.88984 14.9455 6.08243C15.0081 6.27502 15.0124 6.48178 14.9579 6.6768C14.9035 6.87182 14.7927 7.04644 14.6394 7.17877L14.6431 7.17815Z"
        fill="url(#paint0_linear_36_522)"
      />
      <path d="M9.90888 6H6.0907V7H9.90888V6Z" fill="white" />
      <path d="M8.81825 9H7.18188V10H8.81825V9Z" fill="white" />
      <path d="M9.90902 8H8.81812V9H9.90902V8Z" fill="white" />
      <path d="M7.18161 8H6.0907V9H7.18161V8Z" fill="white" />
      <path d="M11.0002 7H9.9093V8H11.0002V7Z" fill="white" />
      <path d="M6.09091 7H5V8H6.09091V7Z" fill="white" />
      <defs>
        <linearGradient
          id="paint0_linear_36_522"
          x1="3.50006"
          y1="14"
          x2="34.5001"
          y2="-12"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFDE18" />
        </linearGradient>
      </defs>
    </svg>
  )
}
