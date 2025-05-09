import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '../../../store/apiSlice';

export const setupStore = () =>
  configureStore({
    reducer: {
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware().concat(apiSlice.middleware),
  });