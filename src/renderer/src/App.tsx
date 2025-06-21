import type { ThunkDispatch } from '@reduxjs/toolkit'
import React, { useState } from 'react'
import { BiLoaderCircle } from 'react-icons/bi'
import { FaRegCircleStop } from 'react-icons/fa6'
import { GoArrowUpLeft } from 'react-icons/go'
import { MdOutlineAddCircleOutline, MdOutlineSummarize } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import type { AnyAction } from 'redux'
import { MODELS } from '../../types/constants'
import { Dialog } from './components/Dialog'
import { Dropdown } from './components/pieces/Dropdown'
import { TextInput } from './components/TextInput'
import { getGreeting, getModelByKey, saveModel } from './components/utils'
import { sendChatMessage, smmarizeChatMessage } from './redux/actions'
import { resetDialog } from './redux/activeDialogSlice'
import type { RootState } from './redux/store'

const MemoDialog = React.memo(Dialog)
MemoDialog.displayName = 'MemoDialog'

const LAST_USED_MODEL_CONFIG_KEY = 'chat_using_model'

function App(): React.JSX.Element {
  const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useDispatch()

  const [chatModel, setChatModel] = useState(getModelByKey(LAST_USED_MODEL_CONFIG_KEY))
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
            <button className="action-button" onClick={newConversation}>
              <MdOutlineAddCircleOutline />
            </button>
            <button className="action-button" id="summarize-dialog" onClick={summarizeDialog}>
              <MdOutlineSummarize />
            </button>
          </div>
          <div className="right">
            <Dropdown
              options={Object.values(MODELS).map((m) => ({ name: m.name, value: m }))}
              defaultOption={{ name: chatModel.name, value: chatModel }}
              select={(model) => {
                setChatModel(model)
                saveModel(LAST_USED_MODEL_CONFIG_KEY, model)
              }}
            />
            <button
              id="send-chat"
              className={'action-button ' + (chatDialogLoading ? 'loading' : '')}
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
