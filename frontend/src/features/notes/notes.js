import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { noteService } from "./noteService"

const initialState = {
    notes: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
}

export const getNotes = createAsyncThunk(
    'notes/fetchednotes',
    async(ticketId, thunkAPI) => {
        try{
            const token = thunkAPI.getState().auth.user.token
            return await noteService.getNotes(ticketId, token)
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


const noteSlice = createSlice({
    name: 'note',
    initialState: initialState,
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(getNotes.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getNotes.fulfilled, (state, action) => {
                state.isSuccess = true
                state.isLoading= false
                state.notes = action.payload
            })
            .addCase(getNotes.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
    }
})

export default noteSlice.reducer