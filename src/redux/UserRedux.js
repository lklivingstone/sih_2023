import { createSlice } from "@reduxjs/toolkit"

const userSlice = createSlice({
    name: "user_details",
    initialState: {
        user: null,
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
            state.user = action.payload
            state.token = action.payload["accessToken"]
        },
        loginFailure: (state) => {
            state.isFetching= false
            state.error= true
        },
        logOut: (state)=> {
            state.user= null
            state.token= null
        }
    }
})

export const { loginStart, loginFailure, loginSuccess, logOut } = userSlice.actions
export default userSlice.reducer