import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { ticketService } from './ticketService'

const initialState = {
    tickets: [],
    ticket: {},
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
}

export const createTicket = createAsyncThunk(
    'tickets/createdTicket',
    async(ticketData, thunkAPI) => {
        try{
            const token = thunkAPI.getState().auth.user.token
            return await ticketService.createTicket(ticketData, token)
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

const ticketSlice = createSlice({
    name: 'tickets',
    initialState: initialState,
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(createTicket.pending, (state) => {
                state.isLoading = true
            })
            .addCase(createTicket.fulfilled, (state) => {
                state.isSuccess = true
                state.isLoading= false
            })
            .addCase(createTicket.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
    }
})


export const { reset } = ticketSlice.actions
export default ticketSlice.reducer