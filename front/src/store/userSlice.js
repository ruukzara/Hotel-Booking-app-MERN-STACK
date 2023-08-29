import { createSlice } from "@reduxjs/toolkit"
import { fromStorage } from "../lib";

const userToken = fromStorage('user_token');

const initialUserData = userToken ? JSON.parse(fromStorage('user')) : {};


const userSlice = createSlice({
    name: 'user',
    initialState: {
        value: initialUserData,
    },
    reducers: {
        addUser: (state, action) => {
            state.value = action.payload
        },
        clearUser: state => {
            state.value = {}
        }
    }
})
export default userSlice.reducer

export const { addUser, clearUser } = userSlice.actions

