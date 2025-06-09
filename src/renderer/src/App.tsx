import type { ThunkDispatch } from '@reduxjs/toolkit'
import React, { useState } from 'react'
import { BiLoaderCircle } from 'react-icons/bi'
import { FaRegCircleStop } from 'react-icons/fa6'
import { GoArrowUpLeft } from 'react-icons/go'
import { MdOutlineAddCircleOutline, MdOutlineSummarize } from 'react-icons/md'
import { RiArrowRightSFill, RiArrowUpSFill } from 'react-icons/ri'
import { useDispatch, useSelector } from 'react-redux'
import type { AnyAction } from 'redux'
import { Dialog } from './components/Dialog'
import { TextInput } from './components/TextInput'
import { getGreeting } from './components/utils'
import { MODELS } from './constants'
import { sendChatMessage, smmarizeChatMessage } from './redux/actions'
import { resetDialog } from './redux/activeDialogSlice'
import type { RootState } from './redux/store'

const MemoDialog = React.memo(Dialog)
MemoDialog.displayName = 'MemoDialog'

const getDefaultModel = () => {
  try {
    const savedModel = window.localStorage.getItem('default_model')
    return savedModel ? JSON.parse(savedModel) : MODELS.GEMMA_3_12B
  } catch (e) {
    console.log(e)
    return MODELS.GEMMA_3_12B
  }
}

const setDefaultModel = (model) => {
  window.localStorage.setItem('default_model', JSON.stringify(model))
}

function App(): React.JSX.Element {
  const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useDispatch()

  const [chatModel, setChatModel] = useState(getDefaultModel())
  const [modelOptionsOpen, setModelOptionsOpen] = useState(false)
  const chatDialogLoading = useSelector(
    (state: RootState) => state.activeDialog.status === 'updating'
  )

  const newConversation = () => {
    dispatch(resetDialog())
  }

  const [chatMsg, setChatMsg] = useState('')
  const sendInput = (): void => {
    if (chatDialogLoading || !chatMsg || !chatMsg.trim()) return
    // Clear the input field after sending
    setChatMsg('')
    dispatch(sendChatMessage(chatMsg, chatModel.id))
  }

  const summarizeDialog = (): void => {
    dispatch(smmarizeChatMessage(chatModel.id))
  }

  const stopChat = (): void => {
    window.api.stopChat()
  }

  return (
    <>
      <h1>{`${getGreeting()}`}</h1>
      <MemoDialog />
      <div id="start-chat-container">
        <TextInput value={chatMsg} updateValue={setChatMsg} onEnter={sendInput} />
        <div id="chat-action-bar">
          <div className="left">
            {chatDialogLoading && (
              <button onClick={stopChat} id="stop-chat">
                <FaRegCircleStop />
              </button>
            )}
            <button onClick={newConversation}>
              <MdOutlineAddCircleOutline />
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
                      setDefaultModel(model)
                      setModelOptionsOpen(false)
                    }}
                  >
                    {model.name}
                  </button>
                ))}
              </div>
            </div>
            <button
              id="send-chat"
              className={chatDialogLoading ? 'loading' : ''}
              disabled={chatDialogLoading || !chatMsg}
              onClick={sendInput}
            >
              {chatDialogLoading ? <BiLoaderCircle /> : <GoArrowUpLeft />}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
