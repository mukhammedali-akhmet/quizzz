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
    posterURL: string | null
    questions: Question[]
}