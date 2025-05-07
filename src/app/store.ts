import { configureStore } from "@reduxjs/toolkit";
import quizListReducer from "../features/quizList/quizListSlice"

export const store = configureStore({
    reducer: {
        quizList: quizListReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch