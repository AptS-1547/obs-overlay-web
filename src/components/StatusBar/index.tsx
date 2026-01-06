import { useSearchParams } from 'react-router-dom'
import styles from './styles.module.css'

function StatusBar() {
  const [searchParams] = useSearchParams()

  // 从 URL 参数获取配置
  const label = searchParams.get('label') || '状态'
  const value = searchParams.get('value') || '在线'
  const icon = searchParams.get('icon') || ''

  return (
    <div className={styles.container}>
      <div className={styles.statusBar}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <span className={styles.label}>{label}:</span>
        <span className={styles.value}>{value}</span>
      </div>
    </div>
  )
}

export default StatusBar
