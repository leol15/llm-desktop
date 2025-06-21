import { MessageInfo } from '@renderer/redux/activeDialogSlice'
import React, { useEffect, useState } from 'react'
import { ChatResponsePart } from 'src/types/apiTypes'
import { MODELS } from '../../../types/constants'
import '../assets/PromptPlayground.css'
import { MemoChatMessage } from './ChatMessage'
import { TextInput } from './TextInput'
import { Dropdown } from './pieces/Dropdown'
import { getModelByKey, saveModel } from './utils'

const LAST_USED_MODEL_CONFIG_KEY = 'llm_playground_using_model'

const key = 'PROMPT_PLAYGROUND_SYSTEM_PROMPT'
export const PromptPlayground = (): React.JSX.Element => {
  const [systemPrompt, setSystemPrompt] = useState(localStorage.getItem(key) || '')
  const [userPrompt, setUserPrompt] = useState('')

  useEffect(() => {
    // console.log('saving system prompt', systemPrompt)
    localStorage.setItem(key, systemPrompt)
  }, [systemPrompt])

  // create bot message
  // const botMessageThunk = createMessage({
  //   content: '',
  //   sender: 'assistant',
  //   status: 'in-progress'
  // })
  // const id: string = dispatch(botMessageThunk)

  const [chatModel, setChatModel] = useState(getModelByKey(LAST_USED_MODEL_CONFIG_KEY))
  const [llmResponse, setLlmResponse] = useState<string>('')
  const [llmResponseInfo, setLlmResponseInfo] = useState<MessageInfo>()

  const receiveChatStream = (data: ChatResponsePart): void => {
    if (data.done) {
      setLlmResponseInfo(data)
    } else {
      setLlmResponse((curr) => curr + data.content)
      // setLlmResponse()
      // llmResponse.content
    }
  }

  const sendPrompt = () => {
    setLlmResponse('')
    window.api.getChatResponseStream(
      {
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        model: chatModel.id
      },
      receiveChatStream
    )
  }

  return (
    <div id="prompt-playground">
      <div className="playground-container">
        <div className="left-panel">
          <h2>Prompt Playground</h2>
          <div>System Prompt</div>
          <TextInput
            value={systemPrompt}
            updateValue={setSystemPrompt}
            placeholder="Enter system prompt here..."
          />
          <div>User Prompt</div>
          <TextInput
            value={userPrompt}
            updateValue={setUserPrompt}
            onEnter={sendPrompt}
            placeholder="Enter user conversation here..."
          />

          <div className="action-bar">
            <Dropdown
              options={Object.values(MODELS).map((m) => ({ name: m.name, value: m }))}
              defaultOption={{ name: chatModel.name, value: chatModel }}
              select={(model) => {
                setChatModel(model)
                saveModel(LAST_USED_MODEL_CONFIG_KEY, model)
              }}
            />
            <button onClick={sendPrompt}>Send</button>
          </div>
        </div>
        <div className="right-panel">
          <div className="llm-output-display">
            {llmResponse && (
              <MemoChatMessage
                message={{
                  id: '1',
                  sender: 'assistant',
                  content: llmResponse,
                  timestamp: '1',
                  status: 'complete'
                }}
                info={llmResponseInfo}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
