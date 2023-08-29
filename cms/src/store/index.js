import { configureStore } from '@reduxjs/toolkit'
import useReducer, { addUser, clearUser } from "./userSlice"

export const store = configureStore ({
  reducer: {
    user: useReducer
  }
})

export { addUser, clearUser }
