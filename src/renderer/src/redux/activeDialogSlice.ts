import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import { Message } from './types'

export interface MessageInfo {
  total_duration?: number
  load_duration?: number
  prompt_eval_count?: number
  prompt_eval_duration?: number
  eval_count?: number
  eval_duration?: number
}

export interface ActiveDialogState {
  dialogId?: string
  messages: Message['id'][]
  messageById: Record<string, Message>
  messageInfoById: Record<string, MessageInfo>
  chatCount: number
  status: 'updating' | 'idle'
  createDate?: string
}

const initialState: ActiveDialogState = {
  dialogId: undefined,
  messages: [],
  messageById: {},
  messageInfoById: {},
  chatCount: 0,
  status: 'idle'
}

export interface AppendMessagePayload {
  id: string
  extra: string
  status: Message['status']
  info?: MessageInfo
}

export const activeDialogSlice = createSlice({
  name: 'activeDialog',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      if (state.dialogId === undefined) {
        state.dialogId = crypto.randomUUID() // Assign a new dialog ID if not set
        state.createDate = new Date().toISOString()
      }
      const message = { ...action.payload }
      state.messages.push(message.id)
      state.messageById[action.payload.id] = message
      state.status = message.status === 'in-progress' ? 'updating' : 'idle'
      state.chatCount += 1
    },
    appendMessage: (state, action: PayloadAction<AppendMessagePayload>) => {
      const { id, extra, status } = action.payload
      if (state.messageById[id]) {
        state.messageById[id].content += extra
        state.messageById[id].status = status
        state.chatCount += 1
        if (status === 'complete') {
          state.status = 'idle'
          state.messageInfoById[id] = action.payload.info || {}
        } else {
          state.status = 'updating'
        }
      }
    },
    resetDialog: (state) => {
      state.dialogId = undefined
      state.messageById = {}
      state.messages = []
      state.status = 'idle'
      state.messageInfoById = {}
      state.chatCount = 0
      state.createDate = undefined
    },
    setDialog: (
      state,
      action: PayloadAction<{
        dialogId: string
        messages: [Message, MessageInfo][]
        createDate: string
      }>
    ) => {
      const { dialogId, messages, createDate } = action.payload
      state.dialogId = dialogId
      state.createDate = createDate
      state.messages = []
      state.messageById = {}
      state.messageInfoById = {}
      state.status = 'idle'
      state.chatCount = messages.length
      messages.forEach(([m, info]) => {
        state.messages.push(m.id)
        state.messageById[m.id] = m
        state.messageInfoById[m.id] = info
      })
    }
  }
})

type CreateMessagePayload = Omit<Message, 'id' | 'timestamp'>
export const createMessage = (payload: CreateMessagePayload) => (dispatch) => {
  const id = crypto.randomUUID()
  const timestamp = new Date().toISOString()
  const message: Message = {
    ...payload,
    id,
    timestamp
  }
  dispatch(addMessage(message))
  return id
}

// Action creators are generated for each case reducer function
export const { addMessage, appendMessage, resetDialog, setDialog } = activeDialogSlice.actions

export default activeDialogSlice.reducer
