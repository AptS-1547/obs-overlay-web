import { useSearchParams } from 'react-router-dom'
import { useRef, useState, useEffect, useCallback } from 'react'

function Ticker() {
  const [searchParams] = useSearchParams()
  const measureRef = useRef<HTMLSpanElement>(null)
  const [repeatCount, setRepeatCount] = useState(4) // 默认值，会被动态计算覆盖
  const [unitWidth, setUnitWidth] = useState(0)

  // 从 URL 参数获取配置
  const text = searchParams.get('text') || 'OBS Overlay Ticker - 这是一条滚动文字示例'
  const speed = parseInt(searchParams.get('speed') || '30', 10)
  const fontSize = parseInt(searchParams.get('fontSize') || '18', 10)
  const separator = searchParams.get('separator') || ' ● '

  // 单个单元 = separator + text
  const unit = `${separator}${text}`

  // 测量并计算重复次数
  const calculateRepeat = useCallback(() => {
    if (!measureRef.current) return
    const width = measureRef.current.offsetWidth
    if (width === 0) return

    setUnitWidth(width)
    // 需要填满两倍屏幕宽度才能无缝循环
    const needed = Math.ceil((window.innerWidth * 2) / width) + 1
    setRepeatCount(Math.max(needed, 4))
  }, [])

  useEffect(() => {
    // 初始计算
    calculateRepeat()

    // 窗口大小变化时重新计算
    window.addEventListener('resize', calculateRepeat)
    return () => window.removeEventListener('resize', calculateRepeat)
  }, [calculateRepeat])

  // 字体加载完成后重新计算
  useEffect(() => {
    document.fonts.ready.then(calculateRepeat)
  }, [calculateRepeat])

  // 动画时长：基于单个单元宽度和速度
  const duration = unitWidth > 0 ? unitWidth / speed : 10

  return (
    <div className="fixed bottom-0 left-0 right-0 py-2 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900/80 flex items-center overflow-hidden">
      {/* 隐藏的测量元素 */}
      <span
        ref={measureRef}
        className="absolute invisible whitespace-nowrap"
        style={{ fontSize: `${fontSize}px` }}
        aria-hidden="true"
      >
        {unit}
      </span>

      {/* 滚动容器 */}
      <div
        className="flex whitespace-nowrap"
        style={{
          animation: unitWidth > 0 ? `ticker-scroll ${duration}s linear infinite` : 'none',
        }}
      >
        {Array.from({ length: repeatCount }, (_, i) => (
          <span
            key={i}
            className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
            style={{ fontSize: `${fontSize}px` }}
          >
            {unit}
          </span>
        ))}
      </div>

      {/* 动态注入动画关键帧 */}
      {unitWidth > 0 && (
        <style>{`
          @keyframes ticker-scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-${unitWidth}px); }
          }
        `}</style>
      )}
    </div>
  )
}

export default Ticker
