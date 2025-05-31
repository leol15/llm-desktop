import type { ThunkDispatch } from '@reduxjs/toolkit'
import { KeyboardEvent, useRef } from 'react'
import { AiOutlineClear } from 'react-icons/ai'
import { GoArrowUpLeft } from 'react-icons/go'
import { useDispatch } from 'react-redux'
import type { AnyAction } from 'redux'
import { Dialog } from './components/Dialog'
import { FramHeader } from './components/FramHeader'
import { sendChatMessage } from './redux/actions'
import { resetDialog } from './redux/activeDialogSlice'
import type { RootState } from './redux/store'

function App(): React.JSX.Element {
  const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useDispatch()

  const inputRef = useRef<HTMLTextAreaElement>(null)

  const clearDialog = () => {
    dispatch(resetDialog())
  }

  const sendInput = (): void => {
    if (!inputRef.current) return
    const inputMsg = inputRef.current?.value
    inputRef.current.value = '' // Clear the input field after sending
    dispatch(sendChatMessage(inputMsg))
  }

  const handleInput = (e: KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault() // Prevents the default newline behavior
      sendInput()
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
            <button id="send-chat" onClick={sendInput}>
              <GoArrowUpLeft />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
