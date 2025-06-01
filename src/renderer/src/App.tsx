import type { ThunkDispatch } from '@reduxjs/toolkit'
import { KeyboardEvent, useRef, useState } from 'react'
import { AiOutlineClear } from 'react-icons/ai'
import { GoArrowUpLeft } from 'react-icons/go'
import { MdOutlineSummarize } from 'react-icons/md'
import { RiArrowRightSFill, RiArrowUpSFill } from 'react-icons/ri'
import { useDispatch } from 'react-redux'
import type { AnyAction } from 'redux'
import { Dialog } from './components/Dialog'
import { FramHeader } from './components/FramHeader'
import { MODELS } from './constants'
import { sendChatMessage, smmarizeChatMessage } from './redux/actions'
import { resetDialog } from './redux/activeDialogSlice'
import type { RootState } from './redux/store'

function App(): React.JSX.Element {
  const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useDispatch()

  const inputRef = useRef<HTMLTextAreaElement>(null)

  const [chatModel, setChatModel] = useState(MODELS.GEMMA_3_1B)
  const [modelOptionsOpen, setModelOptionsOpen] = useState(false)

  const clearDialog = () => {
    dispatch(resetDialog())
  }

  const sendInput = (): void => {
    if (!inputRef.current) return
    const inputMsg = inputRef.current?.value
    if (!inputMsg || !inputMsg.trim()) return
    inputRef.current.value = '' // Clear the input field after sending
    dispatch(sendChatMessage(inputMsg, chatModel.id))
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

  const summarizeDialog = (): void => {
    // Placeholder for summarize dialog functionality
    console.log('Summarize dialog clicked')
    dispatch(smmarizeChatMessage(chatModel.id))
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
            <div className="left">
              <button id="clear-dialog" onClick={clearDialog}>
                <AiOutlineClear />
              </button>
              <button id="summarize-dialog" onClick={summarizeDialog}>
                <MdOutlineSummarize />
              </button>
            </div>
            <div className="right">
              <div id="model-select-dropdown">
                <button id="change-model" onClick={() => setModelOptionsOpen(!modelOptionsOpen)}>
                  {modelOptionsOpen ? <RiArrowUpSFill /> : <RiArrowRightSFill />}
                  <span className="model-name">{chatModel.name}</span>
                </button>
                <div id="model-options" className={modelOptionsOpen ? '' : 'hidden'}>
                  {Object.values(MODELS).map((model) => (
                    <button
                      key={model.id}
                      onClick={() => {
                        setChatModel(model)
                        setModelOptionsOpen(false)
                      }}
                    >
                      {model.name}
                    </button>
                  ))}
                </div>
              </div>
              <button id="send-chat" onClick={sendInput}>
                <GoArrowUpLeft />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
