import { ChatResponsePart, Message } from 'src/types/apiTypes'
import { appendMessage, createMessage } from './activeDialogSlice'
import { RootState } from './store'

export const sendChatMessage =
  (newUserMessage: string) =>
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
    console.log('current messages', messages)

    // create bot message
    const botMessageThunk = createMessage({
      content: '',
      sender: 'assistant',
      status: 'complete'
    })
    const id: string = dispatch(botMessageThunk)

    const receiveChatStream = (data: ChatResponsePart): void => {
      if (data.done) {
        dispatch(appendMessage({ id, extra: '', status: 'complete' }))
      } else {
        dispatch(appendMessage({ id, extra: data.content, status: 'in-progress' }))
      }
    }

    window.api.getChatResponseStream(messages, receiveChatStream)
  }
