import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import blogsReducer from './features/blogsSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        blogs: blogsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

