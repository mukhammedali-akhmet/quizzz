import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { type Quiz } from "../../types"
import { v4 as uuidv4 } from "uuid"
import { updateProfile, type User } from "firebase/auth"
import { auth } from "@/lib/firebase";
import { set } from "zod";
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