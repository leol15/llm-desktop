import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import { Message } from './types'

export interface ActiveDialogState {
  dialogId?: string
  messages: Message['id'][]
  messageById: Record<string, Message>
  chatCount: number
  status: 'updating' | 'idle'
}

const initialState: ActiveDialogState = {
  dialogId: undefined,
  messages: [],
  messageById: {},
  chatCount: 0,
  status: 'idle'
}

export interface AppendMessagePayload {
  id: string
  extra: string
  status: Message['status']
}

export const activeDialogSlice = createSlice({
  name: 'activeDialog',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      if (state.dialogId === undefined) {
        state.dialogId = crypto.randomUUID() // Assign a new dialog ID if not set
      }
      const message = { ...action.payload }
      state.messages.push(message.id)
      state.messageById[action.payload.id] = message
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
        } else {
          state.status = 'updating'
        }
      }
    },
    resetDialog: (state) => {
      state.messageById = {}
      state.messages = []
      state.status = 'idle'
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
export const { addMessage, appendMessage, resetDialog } = activeDialogSlice.actions

export default activeDialogSlice.reducer
