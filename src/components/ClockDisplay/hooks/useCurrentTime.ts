import { useState, useEffect, useMemo } from 'react'

interface UseCurrentTimeOptions {
  showSeconds?: boolean
  shortWeekday?: boolean
  dateFormat?: 'cn' | 'slash'
}

interface UseCurrentTimeReturn {
  time: string          // 时:分:秒 或 时:分
  date: string          // 日期字符串
  weekday: string       // 星期
  hours: string
  minutes: string
  seconds: string
}

const WEEKDAYS = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
const SHORT_WEEKDAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

export function useCurrentTime(options: UseCurrentTimeOptions = {}): UseCurrentTimeReturn {
  const { showSeconds = true, shortWeekday = false, dateFormat = 'cn' } = options
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return useMemo(() => {
    const hours = now.getHours().toString().padStart(2, '0')
    const minutes = now.getMinutes().toString().padStart(2, '0')
    const seconds = now.getSeconds().toString().padStart(2, '0')

    const year = now.getFullYear()
    const month = now.getMonth() + 1
    const day = now.getDate()
    const dayOfWeek = now.getDay()

    const time = showSeconds ? `${hours}:${minutes}:${seconds}` : `${hours}:${minutes}`

    const date = dateFormat === 'cn'
      ? `${year}年${month}月${day}日`
      : `${year}/${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`

    const weekday = shortWeekday ? SHORT_WEEKDAYS[dayOfWeek] : WEEKDAYS[dayOfWeek]

    return {
      time,
      date,
      weekday,
      hours,
      minutes,
      seconds,
    }
  }, [now, showSeconds, shortWeekday, dateFormat])
}
