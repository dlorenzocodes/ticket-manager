import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/auth'
import ticketReducer from '../features/tickets/tickets'
import noteReducer from '../features/notes/notes'

export const store = configureStore({
  reducer: {
   auth: authReducer,
   tickets: ticketReducer,
   notes: noteReducer
  },
});
