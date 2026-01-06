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

// ========== StreamProgress 相关类型 ==========

// 流程节点
export interface StreamPhase {
  id: string
  name: string
  icon?: string         // 可选的图标符号
  duration?: number     // 该节点时长（秒）
}

// 时间进度数据
export interface TimeProgressData {
  startTime: number        // 直播开始时间戳（毫秒）
  plannedDuration: number  // 计划总时长（秒）
  currentTime?: number     // 当前时间戳（用于服务端同步，可选）
}

// 流程进度数据
export interface FlowProgressData {
  phases: StreamPhase[]       // 所有节点
  currentPhaseId: string      // 当前所在节点 ID
  completedPhaseIds?: string[] // 已完成的节点 ID 列表
}

// 完整进度数据（组合使用时）
export interface StreamProgressData {
  time: TimeProgressData
  flow: FlowProgressData
}
