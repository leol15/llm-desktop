import { RootState } from '@renderer/redux/store'
import { Message } from '@renderer/redux/types'
import { useState } from 'react'
import { FaArrowDown, FaArrowUp } from 'react-icons/fa'
import { MdOutlineAccessTime, MdOutlineContentCopy } from 'react-icons/md'
import { SiSpeedtest } from 'react-icons/si'
import ReactMarkdown from 'react-markdown'
import { useSelector } from 'react-redux'

interface ChatMessageProps {
  message: Message['id']
}

const to2Digit = (num?: number): string => {
  if (num === undefined || num < 0) {
    return '0.00'
  }
  return num.toFixed(2)
}

export const ChatMessage = (prop: ChatMessageProps): React.JSX.Element => {
  const message = useSelector((state: RootState) => state.activeDialog.messageById[prop.message])
  const info = useSelector((state: RootState) => state.activeDialog.messageInfoById[prop.message])
  const cssClass = message.sender === 'user' ? 'user-message' : 'assistant-message'

  const [copied, setCopied] = useState(false)
  const copyMessage = () => {
    navigator.clipboard.writeText(message.content).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className={`chat-message ${cssClass}`}>
      <ReactMarkdown>{message.content}</ReactMarkdown>
      {info && (
        <div>
          <div className="assistant-chat-action-group">
            <button className={`copy-btn ${copied ? 'success' : ''}`} onClick={copyMessage}>
              <MdOutlineContentCopy />
            </button>
          </div>
          <div className="message-info">
            <span>
              <FaArrowUp /> {info.prompt_eval_count ?? 0} ({to2Digit(info.prompt_eval_duration)}
              s){' '}
            </span>
            <span>
              <FaArrowDown /> {info.eval_count ?? 0} ({to2Digit(info.eval_duration)}s){' '}
            </span>
            <span>
              <MdOutlineAccessTime /> {to2Digit(info.total_duration)}s{' '}
            </span>
            <span>
              <SiSpeedtest /> {to2Digit((info.eval_count ?? 0) / (info.eval_duration ?? 1))} TPS
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
