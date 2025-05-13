import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

type QuizState = {
    quizzes: QueryDocumentSnapshot<DocumentData, DocumentData>[];
    currentQuizId: string | null;
  };

const initialState: QuizState = {
    quizzes: [],
    currentQuizId: null,
}

const quizListSlice = createSlice({
    name: "quizList",
    initialState,
    reducers: {
        setCurrentQuiz(state, action: PayloadAction<string>) {
            state.currentQuizId = action.payload
        },
        setQuizzes(state, action: PayloadAction<QueryDocumentSnapshot<DocumentData, DocumentData>[]>) {
            state.quizzes = action.payload
        }
    }
})

export const { setCurrentQuiz, setQuizzes } = quizListSlice.actions
export default quizListSlice.reducer