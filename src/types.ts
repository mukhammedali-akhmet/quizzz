export type AnswerOption = {
    text: string
    isCorrect: boolean
}

export type Question = {
    id: number
    text: string
    options: AnswerOption[]
}

export type Quiz = {
    id: string
    title: string
    poster: File | null
    questions: Question[]
}