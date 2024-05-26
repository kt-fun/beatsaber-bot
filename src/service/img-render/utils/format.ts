import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import zh from 'dayjs/locale/zh-cn'
dayjs.extend(duration)
dayjs.extend(relativeTime)
export const formatDuration = (duration: number) => {
  const d = dayjs.duration(duration, 'second')
  return d.format('m[m]s[s]')
}

// export const formatDuration = (duration: number) => {
//   return dayjs.duration(duration,'seconds').format('mm:ss')
// }

export const formatTime = (time: string) => {
  return dayjs(time).locale(zh).fromNow()
}

export const formatNumber = (number: number) => {
  // 1.11w
  try {
    if (number > 10000) {
      return `${(number / 10000.0).toFixed(2)}w`
    }
    // 1.11k
    if (number > 1000) {
      return `${(number / 1000.0).toFixed(2)}k`
    }
    return number.toString()
  } catch (e) {
    return '0'
  }
}
