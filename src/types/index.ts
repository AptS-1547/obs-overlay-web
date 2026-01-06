// 数据源类型
export type DataSourceType = 'websocket' | 'polling'

// 数据源配置
export interface DataSourceConfig {
  type: DataSourceType
  url: string
  pollingInterval?: number // 轮询间隔（毫秒），仅 polling 模式
}

// WebSocket 消息基础类型
export interface WSMessage<T = unknown> {
  type: string
  payload: T
  timestamp?: number
}

// Ticker 数据
export interface TickerData {
  text: string
  speed?: number // 滚动速度
}

// StatusBar 数据
export interface StatusBarData {
  label: string
  value: string
  icon?: string
}

// MessageBox 数据
export interface MessageData {
  id: string
  content: string
  type?: 'info' | 'success' | 'warning' | 'error'
  duration?: number // 显示时长（毫秒）
}

// 全局 Overlay 状态
export interface OverlayState {
  ticker: TickerData | null
  statusBar: StatusBarData | null
  messages: MessageData[]
}
