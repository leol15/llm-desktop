import { RootState } from '@renderer/redux/store'
import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { ChatMessage } from './ChatMessage'

export const Dialog = (): React.JSX.Element => {
  const messages = useSelector((state: RootState) => state.activeDialog.messages)
  const chatCount = useSelector((state: RootState) => state.activeDialog.chatCount)
  const dialogStatus = useSelector((state: RootState) => state.activeDialog.status)
  const ref = useRef<HTMLDivElement>(null)

  const scrollEnabled = useRef(true)
  useEffect(() => {
    if (dialogStatus === 'updating') {
      scrollEnabled.current = true
    }

    const noScroll = () => {
      scrollEnabled.current = false
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 20) {
        // the bottom is reached, re-enable scrolling
        scrollEnabled.current = true
      }
    }
    window.addEventListener('wheel', noScroll)

    return () => {
      window.removeEventListener('wheel', noScroll)
    }
  }, [dialogStatus])

  useEffect(() => {
    if (ref.current && scrollEnabled.current) {
      const targetPosition = ref.current.offsetTop + ref.current.offsetHeight + 50
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      })
    }
  }, [chatCount])
  return (
    <div className="dialog" ref={ref}>
      {messages.map((message, index) => (
        <ChatMessage key={index} message={message} />
      ))}
    </div>
  )
}
