import { useState, useEffect, useMemo } from 'react'
import type { StreamPhase } from '@/types'

interface UseAutoPhaseInput {
  startTime: number
  phases: StreamPhase[]
}

interface UseAutoPhaseReturn {
  currentPhaseId: string
  completedPhaseIds: string[]
  currentPhaseRemaining: number  // 当前节点剩余秒数
  formattedRemaining: string     // 格式化的剩余时间 "12:34" 或 "1:23:45"
  isLastPhase: boolean           // 是否是最后一个节点
  isCompleted: boolean           // 是否所有节点都完成了
}

function formatTime(seconds: number): string {
  const absSeconds = Math.abs(Math.floor(seconds))
  const h = Math.floor(absSeconds / 3600)
  const m = Math.floor((absSeconds % 3600) / 60)
  const s = absSeconds % 60

  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function useAutoPhase({ startTime, phases }: UseAutoPhaseInput): UseAutoPhaseReturn {
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])

  return useMemo(() => {
    // 计算已过去的总秒数
    const elapsedTotal = Math.floor((now - startTime) / 1000)

    // 如果还没开始
    if (elapsedTotal < 0) {
      return {
        currentPhaseId: phases[0]?.id || '0',
        completedPhaseIds: [],
        currentPhaseRemaining: Math.abs(elapsedTotal) + (phases[0]?.duration || 0),
        formattedRemaining: formatTime(Math.abs(elapsedTotal) + (phases[0]?.duration || 0)),
        isLastPhase: phases.length <= 1,
        isCompleted: false,
      }
    }

    // 计算当前在哪个节点
    let accumulated = 0
    let currentIndex = 0
    let currentPhaseRemaining = 0

    for (let i = 0; i < phases.length; i++) {
      const phaseDuration = phases[i].duration || 0
      const phaseEnd = accumulated + phaseDuration

      if (elapsedTotal < phaseEnd) {
        currentIndex = i
        currentPhaseRemaining = phaseEnd - elapsedTotal
        break
      }

      accumulated = phaseEnd

      // 如果是最后一个节点且时间已过
      if (i === phases.length - 1) {
        currentIndex = i
        currentPhaseRemaining = 0
      }
    }

    // 计算已完成的节点
    const completedPhaseIds = phases
      .slice(0, currentIndex)
      .map(p => p.id)

    // 检查是否全部完成
    const totalDuration = phases.reduce((sum, p) => sum + (p.duration || 0), 0)
    const isCompleted = elapsedTotal >= totalDuration

    return {
      currentPhaseId: phases[currentIndex]?.id || '0',
      completedPhaseIds,
      currentPhaseRemaining: Math.max(0, currentPhaseRemaining),
      formattedRemaining: formatTime(Math.max(0, currentPhaseRemaining)),
      isLastPhase: currentIndex === phases.length - 1,
      isCompleted,
    }
  }, [now, startTime, phases])
}
