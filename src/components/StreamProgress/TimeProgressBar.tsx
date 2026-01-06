import type { TimeProgressData } from '@/types'
import { useTimeProgress } from './hooks/useTimeProgress'

interface TimeProgressBarProps {
  data: TimeProgressData
  showLabel?: boolean
  className?: string
}

export function TimeProgressBar({ data, showLabel = true, className = '' }: TimeProgressBarProps) {
  const { progress, isOvertime, formattedElapsed, formattedTotal } = useTimeProgress(data)

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {showLabel && (
        <div className="flex items-center gap-2 text-white/90 font-mono text-sm shrink-0">
          <span className={isOvertime ? 'text-red-400' : 'text-white'}>
            {formattedElapsed}
          </span>
          <span className="text-white/50">/</span>
          <span className="text-white/70">
            {formattedTotal}
          </span>
        </div>
      )}

      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden relative">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-linear relative ${
            isOvertime
              ? 'bg-red-500'
              : 'bg-gradient-to-r from-blue-600 to-blue-400'
          }`}
          style={{ width: `${progress}%` }}
        >
          {/* 头部发光效果 */}
          {progress > 0 && progress < 100 && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white/80 blur-sm animate-pulse" />
          )}
        </div>
      </div>

      {/* 百分比显示 */}
      <span className={`text-sm font-mono shrink-0 ${isOvertime ? 'text-red-400' : 'text-white/70'}`}>
        {Math.round(progress)}%
      </span>
    </div>
  )
}
