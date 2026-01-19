import { Link } from 'react-router-dom'
import styles from './styles.module.css'

function Home() {
  const components = [
    {
      name: 'Ticker',
      path: '/ticker',
      description: '滚动文字',
      params: '?text=你的文字&speed=30',
    },
    {
      name: 'StatusBar',
      path: '/statusbar',
      description: '状态栏',
      params: '?label=状态&value=在线',
    },
    {
      name: 'MessageBox',
      path: '/message',
      description: '消息提示框',
      params: '',
    },
    {
      name: 'StreamProgress',
      path: '/progress',
      description: '直播进度图',
      params: '?startTime=now&phases=开场,游戏,休息,抽奖,结束&durations=1,2,1,1,1',
    },
    {
      name: 'ClockDisplay',
      path: '/clock',
      description: '时间显示',
      params: '?layout=vertical&fontSize=48',
    },
  ]

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>OBS Overlay</h1>
      <p className={styles.subtitle}>
        在 OBS 中为每个组件添加独立的浏览器源
      </p>

      <div className={styles.grid}>
        {components.map(comp => (
          <Link key={comp.path} to={comp.path} className={styles.card}>
            <h2>{comp.name}</h2>
            <p>{comp.description}</p>
            <code className={styles.url}>
              localhost:5173{comp.path}{comp.params}
            </code>
          </Link>
        ))}
      </div>

      <div className={styles.footer}>
        <p>提示：每个组件支持 URL 参数配置，详见各组件文档</p>
      </div>
    </div>
  )
}

export default Home
