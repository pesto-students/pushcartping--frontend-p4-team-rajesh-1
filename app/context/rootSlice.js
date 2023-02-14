import { createSlice } from "@reduxjs/toolkit";

let initialState = {
    user: { type: 0 },
    // carts: {}
}

export const rootSlice = createSlice({
    name: 'root',
    initialState,
    reducers: {
        addUserEntry: (state, action) => {
            // console.log("userSlice curr:", state.user)
            console.log("userSlice addEntry:", action.payload)
            state.user = { ...state.user, ...action.payload }
            // console.log("userSlice new:", state.user)
        }
    }
})

export const { addUserEntry } = rootSlice.actions

export default rootSlice.reducer