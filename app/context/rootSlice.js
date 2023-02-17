import { createSlice } from "@reduxjs/toolkit";
import constants from '../config/constants';

let initialState = {
    user: { type: constants.defaultUserType },
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