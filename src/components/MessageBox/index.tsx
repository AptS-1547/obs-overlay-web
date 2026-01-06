import { useState, useEffect } from 'react'
import styles from './styles.module.css'

interface Message {
  id: string
  content: string
  type: 'info' | 'success' | 'warning' | 'error'
}

function MessageBox() {
  const [messages, setMessages] = useState<Message[]>([])

  // 演示用：添加一条示例消息
  useEffect(() => {
    const demoMessage: Message = {
      id: 'demo-1',
      content: '这是一条示例消息，实际使用时通过 WebSocket 或 API 推送',
      type: 'info',
    }
    setMessages([demoMessage])

    // 5秒后移除演示消息
    const timer = setTimeout(() => {
      setMessages([])
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  // 公开方法：添加消息（供外部调用）
  const addMessage = (message: Omit<Message, 'id'>) => {
    const newMessage: Message = {
      ...message,
      id: `msg-${Date.now()}`,
    }
    setMessages(prev => [...prev, newMessage])

    // 自动移除
    setTimeout(() => {
      setMessages(prev => prev.filter(m => m.id !== newMessage.id))
    }, 4000)
  }

  // 将 addMessage 暴露到 window 对象，方便调试
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).addOverlayMessage = addMessage
  }, [])

  return (
    <div className={styles.container}>
      {messages.map(message => (
        <div
          key={message.id}
          className={`${styles.message} ${styles[message.type]}`}
        >
          {message.content}
        </div>
      ))}
    </div>
  )
}

export default MessageBox
