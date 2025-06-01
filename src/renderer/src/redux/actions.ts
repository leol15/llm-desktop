import { MODELS } from '@renderer/constants'
import { ChatResponsePart, Message } from 'src/types/apiTypes'
import { appendMessage, createMessage } from './activeDialogSlice'
import { RootState } from './store'

export const sendChatMessage =
  (newUserMessage: string, model: string = MODELS.GEMMA_3_1B.id) =>
  (dispatch, getState: () => RootState): void => {
    const userMessageThunk = createMessage({
      content: newUserMessage,
      sender: 'user',
      status: 'complete'
    })
    dispatch(userMessageThunk)

    // get the current dialog
    const messageById = getState().activeDialog.messageById
    const messages: Message[] = getState().activeDialog.messages.map((id) => ({
      role: messageById[id].sender,
      content: messageById[id].content
    }))

    // create bot message
    const botMessageThunk = createMessage({
      content: '',
      sender: 'assistant',
      status: 'complete'
    })
    const id: string = dispatch(botMessageThunk)

    const receiveChatStream = (data: ChatResponsePart): void => {
      if (data.done) {
        dispatch(appendMessage({ id, extra: '', status: 'complete', info: data }))
      } else {
        dispatch(appendMessage({ id, extra: data.content, status: 'in-progress' }))
      }
    }

    window.api.getChatResponseStream({ messages, model }, receiveChatStream)
  }

export const smmarizeChatMessage =
  (model: string = MODELS.GEMMA_3_1B.id) =>
  (dispatch, getState: () => RootState): void => {
    // get the current dialog
    const messageById = getState().activeDialog.messageById
    const messages: Message[] = getState().activeDialog.messages.map((id) => ({
      role: messageById[id].sender,
      content: messageById[id].content
    }))

    // create bot message
    const botMessageThunk = createMessage({
      content: '',
      sender: 'assistant',
      status: 'complete'
    })
    const id: string = dispatch(botMessageThunk)

    const receiveChatStream = (data: ChatResponsePart): void => {
      if (data.done) {
        dispatch(appendMessage({ id, extra: '', status: 'complete', info: data }))
      } else {
        dispatch(appendMessage({ id, extra: data.content, status: 'in-progress' }))
      }
    }

    window.api.summarizeDialogStream({ messages, model }, receiveChatStream)
  }
