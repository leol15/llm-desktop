import { configureStore } from '@reduxjs/toolkit'

import activeDialogReducer from './activeDialogSlice'
export const store = configureStore({
  reducer: {
    activeDialog: activeDialogReducer
  }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
