import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Dialog } from './types'

export interface DialogsState {
  dialogs: Dialog[]
}

const initialState: DialogsState = {
  dialogs: []
}

export const dialogsSlice = createSlice({
  name: 'activeDialog',
  initialState,
  reducers: {
    setDialogs: (state, action: PayloadAction<Dialog[]>) => {
      state.dialogs = action.payload
    }
  }
})

export const { setDialogs } = dialogsSlice.actions

export default dialogsSlice.reducer
