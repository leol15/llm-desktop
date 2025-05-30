import { RootState } from '@renderer/redux/store'
import { Message } from '@renderer/redux/types'
import ReactMarkdown from 'react-markdown'
import { useSelector } from 'react-redux'

interface ChatMessageProps {
  message: Message['id']
}

export const ChatMessage = (prop: ChatMessageProps): React.JSX.Element => {
  // console.log('ChatMessage:', prop.message)
  const message = useSelector((state: RootState) => state.activeDialog.messageById[prop.message])
  const cssClass = message.sender === 'user' ? 'user-message' : 'assistant-message'
  return (
    <div className={`chat-message ${cssClass}`}>
      <ReactMarkdown>{message.content}</ReactMarkdown>
    </div>
  )
}
