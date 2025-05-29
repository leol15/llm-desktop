import { useRef, useState } from 'react'
import { ChatMessage } from './components/ChatMessage'
import { FramHeader } from './components/FramHeader'

function App(): React.JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const [response, setResponse] = useState('')
  const receiveChatStream = (data) => {
    setResponse((prev) => prev + data)
  }

  const sendChatMessage = (): void => {
    if (!inputRef.current) return
    const inputMsg = inputRef.current?.value
    inputRef.current.value = '' // Clear the input field after sending
    window.api.getResponseStream(inputMsg, receiveChatStream)
  }

  const handleInput = (e: KeyboardEvent): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault() // Prevents the default newline behavior
      sendChatMessage()
    }
  }

  return (
    <>
      <FramHeader></FramHeader>
      <div className="app">
        <h1>Good afternoon, Oreo</h1>
        <ChatMessage message={response} />
        <div id="start-chat-container">
          <textarea
            id="start-chat"
            ref={inputRef}
            placeholder="How can I help you today?"
            onKeyDown={(e) => handleInput(e)}
            rows={2}
          />
          <div id="chat-action-bar">
            <button id="send-chat" onClick={sendChatMessage}>
              Send
            </button>
            <button rel="noreferrer" onClick={ipcHandle}>
              Send IPC
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
