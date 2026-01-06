import { useState, useEffect, useMemo } from 'react'
import type { TimeProgressData } from '@/types'

interface UseTimeProgressReturn {
  elapsed: number           // 已过去秒数
  remaining: number         // 剩余秒数
  progress: number          // 进度百分比 0-100
  isOvertime: boolean       // 是否超时
  formattedElapsed: string  // 格式化的已过去时间
  formattedRemaining: string // 格式化的剩余时间
  formattedTotal: string    // 格式化的总时长
}

function formatTime(seconds: number): string {
  const absSeconds = Math.abs(seconds)
  const h = Math.floor(absSeconds / 3600)
  const m = Math.floor((absSeconds % 3600) / 60)
  const s = absSeconds % 60
  const sign = seconds < 0 ? '-' : ''
  return `${sign}${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

export function useTimeProgress(data: TimeProgressData | null): UseTimeProgressReturn {
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])

  return useMemo(() => {
    if (!data) {
      return {
        elapsed: 0,
        remaining: 0,
        progress: 0,
        isOvertime: false,
        formattedElapsed: '00:00:00',
        formattedRemaining: '00:00:00',
        formattedTotal: '00:00:00',
      }
    }

    const currentTime = data.currentTime || now
    const elapsed = Math.floor((currentTime - data.startTime) / 1000)
    const remaining = Math.max(0, data.plannedDuration - elapsed)
    const progress = Math.min((elapsed / data.plannedDuration) * 100, 100)
    const isOvertime = elapsed > data.plannedDuration

    return {
      elapsed: Math.max(0, elapsed),
      remaining,
      progress,
      isOvertime,
      formattedElapsed: formatTime(Math.max(0, elapsed)),
      formattedRemaining: formatTime(remaining),
      formattedTotal: formatTime(data.plannedDuration),
    }
  }, [data, now])
}
