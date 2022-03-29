import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import authService from "./authService"

// Get user from localStorage
const user = JSON.parse(localStorage.getItem('user'))

const initialState = {
    user: user ? user : null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
}

// Registers a new user
export const register = createAsyncThunk(
    'auth/RegisteredUser', 
    async(user, thunkAPI) => {
        try{
            return await authService.register(user)
        }catch(error){
            const message = 
            (error.response && 
            error.response.data &&
            error.response.data.message) || 
            error.message || 
            error.toString()

            console.log(message)
            return thunkAPI.rejectWithValue(message)
        }
    }
)

// Login an user
export const login = createAsyncThunk('auth/LoggedInUser', 
    async(user, thunkAPI) => {
        try{
            return await authService.login(user)
        }catch(error){
            const message = 
            (error.response && 
            error.response.data &&
            error.response.data.message) || 
            error.message || 
            error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const logout = createAsyncThunk('auth/LoggedOutUser', 
    async () => {
        await authService.logout()
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false
            state.isError = false
            state.isSuccess = false
            state.message = ''
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.isLoading = true
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.user = action.payload
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.user = null
                state.message = action.payload
            })
            .addCase(login.pending, (state, action) => {
                state.isLoading = true
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.user = action.payload
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.user = null
                state.message = action.payload
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null
            })
    }
})

export const { reset }  = authSlice.actions
export default authSlice.reducer