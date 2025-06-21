import { ChatResponsePart, Message } from 'src/types/apiTypes'
import { MODELS } from '../../../types/constants'
import { appendMessage, createMessage, MessageInfo, setDialog } from './activeDialogSlice'
import { setDialogs } from './dialogsSlice'
import { RootState } from './store'
import { Message as ReduxMessage } from './types'

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
      status: 'in-progress'
    })
    const id: string = dispatch(botMessageThunk)

    const receiveChatStream = (data: ChatResponsePart): void => {
      if (data.done) {
        dispatch(appendMessage({ id, extra: data.content, status: 'complete', info: data }))
        dispatch(saveCurrentConversation())
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

export const saveCurrentConversation =
  () =>
  (dispatch, getState: () => RootState): void => {
    console.log('saveCurrentConversation')
    const dialog = getState().activeDialog
    if (!dialog.dialogId || !dialog.createDate) return

    window.dataApi.saveDialog({
      dialog: {
        id: dialog.dialogId,
        title: `Chat ${getState().dialogs.dialogs.length + 1}`,
        timestamp: dialog.createDate
      },
      messages: dialog.messages
        .map((id) => dialog.messageById[id])
        .map((m) => ({
          id: m.id,
          sender: m.sender,
          timestamp: m.timestamp,
          content: m.content,
          extra: dialog.messageInfoById[m.id]
        }))
    })

    // reloading dialogs
    dispatch(getDialogs())
  }

export const getDialogs =
  () =>
  (dispatch): void => {
    const dialogs = window.dataApi.getDialogs()

    dispatch(
      setDialogs(
        dialogs.dialogs.map((d) => ({
          id: d.id,
          title: d.title
        }))
      )
    )
  }

export const deleteDialog =
  (dialogId: string) =>
  (dispatch): void => {
    console.log('deleteDialog', dialogId)
    window.dataApi.deleteDialog(dialogId)
    dispatch(getDialogs())
  }

export const getDialog =
  (dialogId: string) =>
  (dispatch): void => {
    const { dialogInfo, messages } = window.dataApi.getDialog(dialogId)
    dispatch(
      setDialog({
        dialogId,
        createDate: dialogInfo.timestamp,
        messages: messages.map((m) => [
          {
            id: m.id,
            timestamp: m.timestamp,
            content: m.content,
            sender: m.sender as ReduxMessage['sender'],
            status: 'complete'
          },
          m.extra as MessageInfo
        ])
      })
    )
  }
