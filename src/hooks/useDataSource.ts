import { useState, useEffect, useCallback, useRef } from 'react'
import type { DataSourceConfig, WSMessage } from '@/types'

interface UseDataSourceOptions<T> {
  config: DataSourceConfig
  onMessage?: (data: T) => void
}

interface UseDataSourceReturn<T> {
  data: T | null
  isConnected: boolean
  error: Error | null
  send: (message: unknown) => void
}

/**
 * 数据源 Hook
 * 支持 WebSocket 和轮询两种模式
 */
export function useDataSource<T>({
  config,
  onMessage,
}: UseDataSourceOptions<T>): UseDataSourceReturn<T> {
  const [data, setData] = useState<T | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<number | null>(null)
  const reconnectAttempts = useRef(0)

  // WebSocket 发送消息
  const send = useCallback((message: unknown) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message))
    }
  }, [])

  // WebSocket 连接
  useEffect(() => {
    if (config.type !== 'websocket') return

    const connect = () => {
      try {
        const ws = new WebSocket(config.url)
        wsRef.current = ws

        ws.onopen = () => {
          setIsConnected(true)
          setError(null)
          reconnectAttempts.current = 0
        }

        ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data) as WSMessage<T>
            setData(message.payload)
            onMessage?.(message.payload)
          } catch {
            console.error('Failed to parse WebSocket message')
          }
        }

        ws.onerror = () => {
          setError(new Error('WebSocket error'))
        }

        ws.onclose = () => {
          setIsConnected(false)
          wsRef.current = null

          // 指数退避重连
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000)
          reconnectAttempts.current++

          reconnectTimeoutRef.current = window.setTimeout(connect, delay)
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Connection failed'))
      }
    }

    connect()

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      wsRef.current?.close()
    }
  }, [config.type, config.url, onMessage])

  // 轮询模式
  useEffect(() => {
    if (config.type !== 'polling') return

    const interval = config.pollingInterval || 5000

    const fetchData = async () => {
      try {
        const response = await fetch(config.url)
        if (!response.ok) throw new Error('Fetch failed')

        const result = await response.json() as T
        setData(result)
        setIsConnected(true)
        setError(null)
        onMessage?.(result)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Fetch failed'))
        setIsConnected(false)
      }
    }

    fetchData()
    const timer = setInterval(fetchData, interval)

    return () => clearInterval(timer)
  }, [config.type, config.url, config.pollingInterval, onMessage])

  return { data, isConnected, error, send }
}

export default useDataSource
