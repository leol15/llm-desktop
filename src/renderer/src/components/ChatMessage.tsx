import ReactMarkdown from 'react-markdown'

interface ChatMessageProps {
  message: string
}

export const ChatMessage = (prop: ChatMessageProps): React.JSX.Element => {
  return (
    <div className="chat-message">
      <ReactMarkdown>{prop.message}</ReactMarkdown>
    </div>
  )
}
