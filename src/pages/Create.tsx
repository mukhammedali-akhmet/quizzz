import { useDispatch } from "react-redux"
import { addQuiz } from "../features/quizList/quizListSlice"
import { type AppDispatch } from "../app/store"
import { type Question } from "../types"
import { useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, Save, Trash2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
} from "@/components/ui/pagination"
import { ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu"
import { ContextMenu, ContextMenuContent } from "@radix-ui/react-context-menu"
import { useState } from "react"

const Create = () => {
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()

    const [title, setTitle] = useState("");
    const [poster, setPoster] = useState<File | null>(null)
    const [questions, setQuestions] = useState<Question[]>([
        {
            id: 1,
            text: "",
            options: [
                { text: "", isCorrect: false },
                { text: "", isCorrect: false },
                { text: "", isCorrect: false },
                { text: "", isCorrect: false },
            ],
        }
    ])
    const [currentQuestionId, setCurrentQuestionId] = useState(1)
    const currentQuestion = questions.find((q) => q.id === currentQuestionId)

    const addQuestion = () => {
        const newQuestion: Question = {
            id: questions.length + 1,
            text: "",
            options: [
                { text: "", isCorrect: false },
                { text: "", isCorrect: false },
                { text: "", isCorrect: false },
                { text: "", isCorrect: false },
            ],
        }
        setQuestions([...questions, newQuestion])
    }

    const updateQuestionText = (id: number, newText: string) => {
        setQuestions((prev) =>
            prev.map((q) => (q.id === id ? { ...q, text: newText } : q))
        )
    }

    const updateOption = (qId: number, index: number, text: string) => {
        setQuestions((prev) =>
            prev.map((q) =>
                q.id === qId
                    ? {
                        ...q,
                        options: q.options.map((opt, i) =>
                            i === index ? { ...opt, text } : opt
                        ),
                    }
                    : q
            )
        )
    }

    const setCorrectOption = (qId: number, index: number) => {
        setQuestions((prev) =>
            prev.map((q) =>
                q.id === qId
                    ? {
                        ...q,
                        options: q.options.map((opt, i) => ({
                            ...opt,
                            isCorrect: i === index,
                        })),
                    }
                    : q
            )
        )
    }

    const deleteQuestion = (id: number) => {
        setQuestions((prev) => prev.filter((q) => q.id !== id))
        if (currentQuestionId === id) {
            setCurrentQuestionId(questions[0].id)
        }
        for (let i = 0; i < questions.length; i++) {
            if (questions[i].id > id) {
                setQuestions((prev) =>
                    prev.map((q) => (q.id === questions[i].id ? { ...q, id: q.id - 1 } : q))
                )
            }
        }
        setCurrentQuestionId((prev) => (prev > id ? prev - 1 : prev))
    }

    const handleSubmit = () => {
        if (!title || questions.length === 0) return alert("Fill required inputs")

        dispatch(addQuiz({ title, questions, poster }))
        navigate("/")
    }

    return (
        <section>
            <div className="max-container">
                <header className="flex justify-between items-center">
                    <div className="flex gap-4 items-center">
                        <Input placeholder="Title of the quiz..." value={title} onChange={(e) => setTitle(e.target.value)} />
                        <div className="flex flex-col gap-2">
                            <Label className="cursor-grab" htmlFor="poster">
                                Poster of the quiz
                            </Label>
                            <Input className="cursor-grab" id="poster" type="file" onChange={(e) => setPoster(e.target.files ? e.target.files[0] : null)} />
                        </div>
                    </div>
                    <Button className="text-foreground " onClick={handleSubmit}>
                        <Save />
                        <span>Publish</span>
                    </Button>
                </header>
                <div className="flex flex-col gap-4 mt-20">
                    {currentQuestion && (
                        <div key={currentQuestion.id} className="flex flex-col gap-10 items-center">
                            <Input className="w-1/3" placeholder="Question text..." value={currentQuestion.text} onChange={(e) => updateQuestionText(currentQuestion.id, e.target.value)} />
                            <div className="grid grid-cols-2 gap-5 w-1/2">
                                {currentQuestion.options.map((option, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <Input className="w-2/3" placeholder={`Option ${index + 1}`} value={option.text} onChange={(e) => updateOption(currentQuestion.id, index, e.target.value)} />
                                        <Input className="w-6 h-6 caret-green-500 bg-green-500" type="radio" name={`correct-${currentQuestion.id}`} checked={option.isCorrect} onChange={() => setCorrectOption(currentQuestion.id, index)} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <Pagination>
                        <PaginationContent className="flex gap-2">
                            {questions.map((question) => (
                                <ContextMenu>
                                    <ContextMenuTrigger key={question.id}>
                                        <PaginationItem onClick={() => setCurrentQuestionId(question.id)} className={`cursor-pointer ${currentQuestionId === question.id ? "bg-primary" : ""}`}>
                                            <PaginationLink>{question.id}</PaginationLink>
                                        </PaginationItem>
                                    </ContextMenuTrigger>
                                    <ContextMenuContent>
                                        <ContextMenuItem onClick={() => deleteQuestion(question.id)} className="text-red-500 cursor-pointer bg-red-200 duration-200">
                                            <Trash2 className="text-red-500" />
                                            <span className="text-red-500">Delete</span>
                                        </ContextMenuItem>
                                    </ContextMenuContent>
                                </ContextMenu>
                            ))}
                            <PaginationLink onClick={() => {
                                addQuestion();
                                setCurrentQuestionId(questions.length + 1);
                            }} className="text-foreground cursor-pointer"><Plus /></PaginationLink>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        </section>
    )
}

export default Create
