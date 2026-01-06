import { useState, useEffect, useCallback, useRef } from 'react'

interface UseWebSocketOptions {
  url: string
  onMessage?: (data: unknown) => void
  onOpen?: () => void
  onClose?: () => void
  onError?: (error: Event) => void
  heartbeatInterval?: number // 心跳间隔（毫秒）
  reconnect?: boolean
}

interface UseWebSocketReturn {
  isConnected: boolean
  send: (data: unknown) => void
  close: () => void
}

/**
 * WebSocket Hook
 * 支持自动重连和心跳
 */
export function useWebSocket({
  url,
  onMessage,
  onOpen,
  onClose,
  onError,
  heartbeatInterval = 30000,
  reconnect = true,
}: UseWebSocketOptions): UseWebSocketReturn {
  const [isConnected, setIsConnected] = useState(false)

  const wsRef = useRef<WebSocket | null>(null)
  const heartbeatRef = useRef<number | null>(null)
  const reconnectRef = useRef<number | null>(null)
  const reconnectAttempts = useRef(0)

  const startHeartbeat = useCallback(() => {
    if (heartbeatRef.current) clearInterval(heartbeatRef.current)

    heartbeatRef.current = window.setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'ping' }))
      }
    }, heartbeatInterval)
  }, [heartbeatInterval])

  const stopHeartbeat = useCallback(() => {
    if (heartbeatRef.current) {
      clearInterval(heartbeatRef.current)
      heartbeatRef.current = null
    }
  }, [])

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(url)
      wsRef.current = ws

      ws.onopen = () => {
        setIsConnected(true)
        reconnectAttempts.current = 0
        startHeartbeat()
        onOpen?.()
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          // 忽略心跳响应
          if (data.type === 'pong') return
          onMessage?.(data)
        } catch {
          // 非 JSON 数据
          onMessage?.(event.data)
        }
      }

      ws.onerror = (event) => {
        onError?.(event)
      }

      ws.onclose = () => {
        setIsConnected(false)
        stopHeartbeat()
        wsRef.current = null
        onClose?.()

        // 自动重连
        if (reconnect) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000)
          reconnectAttempts.current++
          reconnectRef.current = window.setTimeout(connect, delay)
        }
      }
    } catch (err) {
      console.error('WebSocket connection error:', err)
    }
  }, [url, onMessage, onOpen, onClose, onError, reconnect, startHeartbeat, stopHeartbeat])

  const send = useCallback((data: unknown) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(typeof data === 'string' ? data : JSON.stringify(data))
    }
  }, [])

  const close = useCallback(() => {
    if (reconnectRef.current) {
      clearTimeout(reconnectRef.current)
    }
    stopHeartbeat()
    wsRef.current?.close()
  }, [stopHeartbeat])

  useEffect(() => {
    connect()
    return () => {
      if (reconnectRef.current) {
        clearTimeout(reconnectRef.current)
      }
      stopHeartbeat()
      wsRef.current?.close()
    }
  }, [connect, stopHeartbeat])

  return { isConnected, send, close }
}

export default useWebSocket
