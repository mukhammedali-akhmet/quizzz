import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { type Quiz } from "../../types"
import { v4 as uuidv4 } from "uuid"

type QuizState = {
    quizzes: Quiz[]
    filteredQuizzes: Quiz[]
    currentQuizId: string | null
}

const initialState: QuizState = {
    quizzes: [],
    filteredQuizzes: [],
    currentQuizId: null,
}

const quizListSlice = createSlice({
    name: "quiz-list",
    initialState,
    reducers: {
        addQuiz(state, action: PayloadAction<Omit<Quiz, "id">>) {
            const newQuiz: Quiz = { ...action.payload, id: uuidv4() }
            state.quizzes.push(newQuiz)
        },
        setCurrentQuiz(state, action: PayloadAction<string>) {
            state.currentQuizId = action.payload
        },
        searchQuizes(state, action: PayloadAction<string>) {
            if (action.payload) {
                const searchedQuizes = state.quizzes.filter(quiz => {
                    return quiz.title.includes(action.payload)
                })
                state.filteredQuizzes = searchedQuizes
            } else {
                state.filteredQuizzes = state.quizzes
            }
        }
    }
})

export const { addQuiz, searchQuizes } = quizListSlice.actions
export default quizListSlice.reducer