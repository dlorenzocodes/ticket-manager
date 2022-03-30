import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/auth'
import ticketReducer from '../features/tickets/tickets'

export const store = configureStore({
  reducer: {
   auth: authReducer,
   tickets: ticketReducer
  },
});
