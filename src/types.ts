export type Option = {
    label: string
    isCorrect: boolean
}

export type Question = {
    id: string
    title: string
    type: "multiple" | "single"
    options: Option[]
}

export type Quiz = {
    title: string
    description: string
    category: string
    tags: string[]
    author: string
    coverURL: string
    plays: number
    questions: Question[]
}

export type CustomUser = {
    name: string
    email: string
    username: string
    profilePicture?: string
}