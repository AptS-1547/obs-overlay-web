import { useSearchParams } from 'react-router-dom'
import { useMemo } from 'react'
import { TimeProgressBar } from './TimeProgressBar'
import { FlowTimeline } from './FlowTimeline'
import { useAutoPhase } from './hooks/useAutoPhase'
import type { TimeProgressData, StreamPhase } from '@/types'

type DisplayMode = 'combined' | 'time' | 'flow'

interface ParsedData {
  time: TimeProgressData
  phases: StreamPhase[]
  startTime: number
}

// 从 URL 参数解析数据
function parseUrlParams(searchParams: URLSearchParams): ParsedData | null {
  const startTimeParam = searchParams.get('startTime')
  const durationParam = searchParams.get('duration')
  const phasesParam = searchParams.get('phases')
  const durationsParam = searchParams.get('durations')

  // startTime 支持两种格式：时间戳 或 "now"
  let startTime: number
  if (startTimeParam === 'now' || !startTimeParam) {
    startTime = Date.now()
  } else {
    startTime = parseInt(startTimeParam, 10)
  }

  // 解析节点名称
  const phaseNames = phasesParam?.split(',').map(s => s.trim()) || ['开始', '进行中', '结束']

  // 解析每个节点的时长（分钟 -> 秒）
  let phaseDurations: number[]

  if (durationsParam) {
    // 使用 durations 参数
    const durations = durationsParam.split(',').map(s => parseInt(s.trim(), 10) * 60)
    phaseDurations = phaseNames.map((_, i) => {
      // 如果 durations 不够，用最后一个值
      return durations[i] ?? durations[durations.length - 1] ?? 600
    })
  } else {
    // 使用 duration 参数平分
    const totalDuration = durationParam ? parseInt(durationParam, 10) : 7200
    const perPhase = Math.floor(totalDuration / phaseNames.length)
    phaseDurations = phaseNames.map(() => perPhase)
  }

  // 构建 phases 数组
  const phases: StreamPhase[] = phaseNames.map((name, i) => ({
    id: String(i),
    name,
    duration: phaseDurations[i],
  }))

  // 计算总时长
  const totalDuration = phaseDurations.reduce((sum, d) => sum + d, 0)

  const timeData: TimeProgressData = {
    startTime,
    plannedDuration: totalDuration,
  }

  return {
    time: timeData,
    phases,
    startTime,
  }
}

function StreamProgress() {
  const [searchParams] = useSearchParams()

  // 布局模式：combined（上下布局）| time | flow
  const mode = (searchParams.get('mode') || 'combined') as DisplayMode

  // 解析数据
  const data = useMemo(() => parseUrlParams(searchParams), [searchParams])

  // 使用自动切换 hook
  const autoPhase = useAutoPhase({
    startTime: data?.startTime || Date.now(),
    phases: data?.phases || [],
  })

  if (!data) {
    return (
      <div className="p-4 text-white/50 text-sm">
        缺少进度数据
      </div>
    )
  }

  // 构建 FlowProgressData
  const flowData = {
    phases: data.phases,
    currentPhaseId: autoPhase.currentPhaseId,
    completedPhaseIds: autoPhase.completedPhaseIds,
  }

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="flex flex-col gap-4 p-4 bg-black/60 rounded-lg backdrop-blur-sm min-w-[300px] max-w-[800px] w-full">
        {/* 时间进度条 */}
        {(mode === 'combined' || mode === 'time') && (
          <TimeProgressBar data={data.time} />
        )}

        {/* 流程节点图 */}
        {(mode === 'combined' || mode === 'flow') && (
          <FlowTimeline
            data={flowData}
            currentRemaining={autoPhase.currentPhaseRemaining}
            formattedRemaining={autoPhase.formattedRemaining}
          />
        )}
      </div>
    </div>
  )
}

export default StreamProgress
