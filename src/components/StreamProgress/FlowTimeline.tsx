import type { FlowProgressData, StreamPhase } from '@/types'

interface FlowTimelineProps {
  data: FlowProgressData
  currentRemaining?: number   // 当前节点剩余秒数
  formattedRemaining?: string // 格式化的剩余时间
  className?: string
}

type PhaseStatus = 'completed' | 'current' | 'pending'

function PhaseNode({
  phase,
  status,
  countdown,
  isUrgent,
}: {
  phase: StreamPhase
  status: PhaseStatus
  countdown?: string
  isUrgent?: boolean
}) {
  const nodeContent = {
    completed: '\u2713', // checkmark
    current: phase.icon || '\u25CF', // filled circle or icon
    pending: '\u25CB', // empty circle
  }

  const nodeClasses = {
    completed: 'bg-green-500 text-white border-green-500',
    current: isUrgent
      ? 'bg-red-500 text-white border-red-500 animate-pulse shadow-lg shadow-red-500/50'
      : 'bg-blue-500 text-white border-blue-500 animate-pulse shadow-lg shadow-blue-500/50',
    pending: 'bg-transparent text-gray-500 border-gray-500',
  }

  const labelClasses = {
    completed: 'text-green-400',
    current: isUrgent ? 'text-red-400 font-bold' : 'text-blue-400 font-bold',
    pending: 'text-gray-500',
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 transition-all ${nodeClasses[status]}`}
      >
        {nodeContent[status]}
      </div>
      <span className={`text-xs whitespace-nowrap ${labelClasses[status]}`}>
        {phase.name}
      </span>
      {/* 当前节点显示倒计时 */}
      {status === 'current' && countdown && (
        <span className={`text-sm font-mono font-bold animate-pulse ${isUrgent ? 'text-red-400' : 'text-blue-400'}`}>
          {countdown}
        </span>
      )}
    </div>
  )
}

function ConnectLine({ completed }: { completed: boolean }) {
  return (
    <div
      className={`w-8 sm:w-12 h-0.5 mx-1 transition-colors ${
        completed ? 'bg-green-500' : 'bg-gray-600'
      }`}
    />
  )
}

export function FlowTimeline({
  data,
  currentRemaining,
  formattedRemaining,
  className = '',
}: FlowTimelineProps) {
  const getStatus = (phase: StreamPhase): PhaseStatus => {
    if (phase.id === data.currentPhaseId) return 'current'
    if (data.completedPhaseIds?.includes(phase.id)) return 'completed'
    return 'pending'
  }

  const isLineCompleted = (index: number): boolean => {
    const phase = data.phases[index]
    return getStatus(phase) === 'completed'
  }

  // 判断倒计时是否快结束（最后30秒变红）
  const isUrgent = (currentRemaining ?? 0) <= 30 && (currentRemaining ?? 0) > 0

  return (
    <div className={`flex items-start justify-center flex-wrap gap-y-4 ${className}`}>
      {data.phases.map((phase, index) => {
        const status = getStatus(phase)
        const showCountdown = status === 'current' && formattedRemaining

        return (
          <div key={phase.id} className="flex items-start">
            <PhaseNode
              phase={phase}
              status={status}
              countdown={showCountdown ? formattedRemaining : undefined}
              isUrgent={status === 'current' ? isUrgent : false}
            />

            {/* 连接线（最后一个节点后不显示） */}
            {index < data.phases.length - 1 && (
              <div className="flex items-center h-8">
                <ConnectLine completed={isLineCompleted(index)} />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
