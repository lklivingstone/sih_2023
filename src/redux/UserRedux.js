import { createSlice } from "@reduxjs/toolkit"

const userSlice = createSlice({
    name: "user",
    initialState: {
        username: null,
        user_id: null,
        token: null,
        isFetching: false,
        error: false
    },
    reducers: {
        loginStart: (state) => {
            state.isFetching= true
        },
        loginSuccess: (state, action)=> {
            state.isFetching = false
            state.error = false
            state.username = action.payload["username"]
            state.user_id = action.payload["user_id"]
            state.token = action.payload["access_token"]
        },
        loginFailure: (state) => {
            state.isFetching= false
            state.error= true
        },
        logOut: (state)=> {
            state.username= null
            state.user_id= null
            state.token= null
        }
    }
})

export const { loginStart, loginFailure, loginSuccess, logOut } = userSlice.actions
export default userSlice.reducer