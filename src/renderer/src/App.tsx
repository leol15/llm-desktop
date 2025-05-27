import { useRef } from 'react'
import { FramHeader } from './components/FramHeader'

function App(): React.JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
  const chatHanle = (): void => {
    window.electron.ipcRenderer.invoke('chat', inputRef.current?.value)
  }

  const inputRef = useRef<HTMLTextAreaElement>(null)
  return (
    <>
      <FramHeader></FramHeader>
      <div className="app">
        <h1>Good afternoon, Oreo</h1>
        <div id="start-chat-container">
          <textarea
            id="start-chat"
            ref={inputRef}
            placeholder="How can I help you today?"
            rows={2}
          />
          <div id="chat-action-bar">
            <button id="send-chat" onClick={chatHanle}>
              Send
            </button>
            <button rel="noreferrer" onClick={ipcHandle}>
              Send IPC
            </button>
          </div>
        </div>
        <div className="action"></div>
      </div>
    </>
  )
}

export default App
