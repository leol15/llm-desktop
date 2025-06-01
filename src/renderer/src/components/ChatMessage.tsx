import { RootState } from '@renderer/redux/store'
import { Message } from '@renderer/redux/types'
import { FaArrowDown, FaArrowUp } from 'react-icons/fa'
import { MdOutlineAccessTime } from 'react-icons/md'
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
  // console.log('ChatMessage:', prop.message)
  const message = useSelector((state: RootState) => state.activeDialog.messageById[prop.message])
  const info = useSelector((state: RootState) => state.activeDialog.messageInfoById[prop.message])
  const cssClass = message.sender === 'user' ? 'user-message' : 'assistant-message'

  return (
    <div className={`chat-message ${cssClass}`}>
      <ReactMarkdown>{message.content}</ReactMarkdown>
      {info && (
        <div className="message-info">
          <span>
            <FaArrowUp /> {info.prompt_eval_count} ({to2Digit(info.prompt_eval_duration)}s){' '}
          </span>
          <span>
            <FaArrowDown /> {info.eval_count} ({to2Digit(info.eval_duration)}s){' '}
          </span>
          <span>
            <MdOutlineAccessTime /> {to2Digit(info.total_duration)}s{' '}
          </span>
          <span>
            <SiSpeedtest /> {to2Digit((info.eval_count ?? 0) / (info.eval_duration ?? 1))} TPS
          </span>
        </div>
      )}
    </div>
  )
}
