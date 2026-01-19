import { useSearchParams } from 'react-router-dom'
import { useCurrentTime } from './hooks/useCurrentTime'

type Layout = 'vertical' | 'horizontal' | 'compact'

function ClockDisplay() {
  const [searchParams] = useSearchParams()

  // 解析 URL 参数
  const showSeconds = searchParams.get('seconds') !== 'false'
  const showDate = searchParams.get('date') !== 'false'
  const showWeekday = searchParams.get('weekday') !== 'false'
  const shortWeekday = searchParams.get('shortWeekday') === 'true'
  const layout = (searchParams.get('layout') || 'vertical') as Layout
  const dateFormat = (searchParams.get('dateFormat') || 'cn') as 'cn' | 'slash'
  const fontSize = parseInt(searchParams.get('fontSize') || '48', 10)
  const bgOpacity = parseInt(searchParams.get('bgOpacity') || '60', 10)

  const { time, date, weekday } = useCurrentTime({
    showSeconds,
    shortWeekday,
    dateFormat,
  })

  // 布局：vertical（默认）
  if (layout === 'vertical') {
    return (
      <div className="w-full h-full flex items-center justify-center p-4">
        <div
          className="flex flex-col items-center gap-2 px-8 py-6 rounded-lg backdrop-blur-sm"
          style={{ backgroundColor: `rgba(0, 0, 0, ${bgOpacity / 100})` }}
        >
          <div
            className="text-white font-bold tabular-nums tracking-wide"
            style={{ fontSize: `${fontSize}px` }}
          >
            {time}
          </div>
          {showDate && (
            <div className="text-white/80 text-xl">
              {date}
            </div>
          )}
          {showWeekday && (
            <div className="text-white/70 text-lg">
              {weekday}
            </div>
          )}
        </div>
      </div>
    )
  }

  // 布局：horizontal
  if (layout === 'horizontal') {
    return (
      <div className="w-full h-full flex items-center justify-center p-4">
        <div
          className="flex items-center gap-6 px-8 py-6 rounded-lg backdrop-blur-sm"
          style={{ backgroundColor: `rgba(0, 0, 0, ${bgOpacity / 100})` }}
        >
          <div
            className="text-white font-bold tabular-nums tracking-wide"
            style={{ fontSize: `${fontSize}px` }}
          >
            {time}
          </div>
          {(showDate || showWeekday) && (
            <div className="border-l border-white/30 h-16" />
          )}
          <div className="flex flex-col gap-1">
            {showDate && (
              <div className="text-white/80 text-xl">
                {date}
              </div>
            )}
            {showWeekday && (
              <div className="text-white/70 text-lg">
                {weekday}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // 布局：compact
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div
        className="flex flex-col items-center gap-1 px-8 py-4 rounded-lg backdrop-blur-sm"
        style={{ backgroundColor: `rgba(0, 0, 0, ${bgOpacity / 100})` }}
      >
        <div
          className="text-white font-bold tabular-nums tracking-wide"
          style={{ fontSize: `${fontSize}px` }}
        >
          {time}
        </div>
        {(showDate || showWeekday) && (
          <div className="text-white/80 text-lg">
            {showDate && date}
            {showDate && showWeekday && ' '}
            {showWeekday && weekday}
          </div>
        )}
      </div>
    </div>
  )
}

export default ClockDisplay
