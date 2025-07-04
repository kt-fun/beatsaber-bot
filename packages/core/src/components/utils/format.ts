import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration.js'
import relativeTime from 'dayjs/plugin/relativeTime.js'
import zh from 'dayjs/locale/zh-cn.js'
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

export function formatRelativeTimeByDay(time: string | number | Date) {
  let res = dayjs().diff(dayjs(time), 'd')
  let unit = 'd'
  if (res <= 0) {
    res = dayjs().diff(dayjs(time), 'h')
    unit = 'h'
  }
  if (res <= 0) {
    res = dayjs().diff(dayjs(time), 'm')
    unit = 'm'
  }
  return `${res}${unit}`
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

export function numberWithCommas(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
export const formatDate = (time: Date | undefined, template?: string) => {
  if (!time) return undefined
  return dayjs(time).format(template ?? 'YYYY-MM-DD')
}
