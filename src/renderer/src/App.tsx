import { KeyboardEvent, useRef } from 'react'
import { AiOutlineClear } from 'react-icons/ai'
import { GoArrowUpLeft } from 'react-icons/go'
import { useDispatch } from 'react-redux'
import { Dialog } from './components/Dialog'
import { FramHeader } from './components/FramHeader'
import { appendMessage, createMessage, resetDialog } from './redux/activeDialogSlice'

function App(): React.JSX.Element {
  const dispatch = useDispatch()

  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const clearDialog = () => {
    dispatch(resetDialog())
  }

  const sendChatMessage = (): void => {
    if (!inputRef.current) return
    const inputMsg = inputRef.current?.value
    inputRef.current.value = '' // Clear the input field after sending
    // create a new message
    const userMessageThunk = createMessage({
      content: inputMsg,
      sender: 'user',
      status: 'complete'
    })
    dispatch(userMessageThunk)

    // create bot message
    const botMessageThunk = createMessage({
      content: '',
      sender: 'assistant',
      status: 'complete'
    })
    const id: string = dispatch(botMessageThunk)

    const receiveChatStream = (data: string) => {
      dispatch(appendMessage({ id, extra: data, status: 'in-progress' }))
    }

    const receiveChatStreamEnd = () => {
      console.log('Stream ended')
      dispatch(appendMessage({ id, extra: '', status: 'complete' }))
    }

    window.api.getResponseStream(inputMsg, receiveChatStream, receiveChatStreamEnd)
  }

  const handleInput = (e: KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault() // Prevents the default newline behavior
      sendChatMessage()
    }
    const ele = e.currentTarget
    setTimeout(() => {
      ele.style.height = 'auto'
      ele.style.height = ele.scrollHeight + 'px'
    }, 1)
  }

  return (
    <>
      <FramHeader />
      <div className="app">
        <h1>Good afternoon, Oreo</h1>
        <Dialog />
        <div id="start-chat-container">
          <textarea
            id="start-chat"
            ref={inputRef}
            placeholder="How can I help you today?"
            onKeyDown={(e) => handleInput(e)}
            rows={2}
          />
          <div id="chat-action-bar">
            <button id="clear-dialog" onClick={clearDialog}>
              <AiOutlineClear />
            </button>
            <button id="send-chat" onClick={sendChatMessage}>
              <GoArrowUpLeft />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
