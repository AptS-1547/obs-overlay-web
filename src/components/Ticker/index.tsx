import { useSearchParams } from 'react-router-dom'
import styles from './styles.module.css'

function Ticker() {
  const [searchParams] = useSearchParams()

  // 从 URL 参数获取配置
  const text = searchParams.get('text') || 'OBS Overlay Ticker - 这是一条滚动文字示例'
  const speed = parseInt(searchParams.get('speed') || '30', 10)

  // 计算动画时长（文字越长，时间越长）
  const duration = Math.max(text.length * (100 / speed), 5)

  return (
    <div className={styles.container}>
      <div
        className={styles.ticker}
        style={{
          animationDuration: `${duration}s`,
        }}
      >
        <span className={styles.text}>{text}</span>
        <span className={styles.text}>{text}</span>
      </div>
    </div>
  )
}

export default Ticker
