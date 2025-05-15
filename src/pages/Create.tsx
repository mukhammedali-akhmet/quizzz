import { useDispatch, useSelector } from "react-redux"
import { type AppDispatch, type RootState } from "../app/store"
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
import { toast } from "sonner"
import { addDoc, collection } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { toggleModal } from "@/features/modal/modalSlice"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const Create = () => {
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()

    const user = useSelector((state: RootState) => state.user)

    const [title, setTitle] = useState("Untitled Quiz");
    const [poster, setPoster] = useState<string | null>()
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
            setCurrentQuestionId(questions[0]?.id || 1)
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

    const handleSubmit = async () => {
        if (!title || questions.length === 0) return toast("Fill in the title of the Quiz")

        navigate("/")
        dispatch
        await addDoc(collection(db, "quizList"), {
            title: title,
            questions: questions,
            posterUrl: poster || "/no-image.svg",
            uid: user.uid,
        })
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setPoster(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    user.uid || dispatch(toggleModal())

    return user.uid ? (
        <section>
            <div className="max-container">
                <header className="flex justify-end md:items-center">
                    <Dialog>
                        <DialogTrigger>
                            <Button>
                                <Save />
                                <span>Publish</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="gap-10">
                            <DialogHeader className="font-bold text-2xl">Publising the quiz</DialogHeader>
                            <div className="flex flex-col gap-5">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="title">
                                        Title of the quiz
                                    </Label>
                                    <Input id="title" placeholder="Title of the quiz..." value={title} onChange={(e) => setTitle(e.target.value)} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="poster">
                                        Poster of the quiz
                                    </Label>
                                    <Input className="w-1/2" id="poster" type="file" onChange={(e) => handleFileChange(e)} />
                                </div>
                                {poster && <div className="flex flex-col gap-2">
                                    <img src={poster} className="w-full aspect-[16/9]" />
                                    <caption>Poster preview</caption>
                                </div>}
                            </div>
                            <Button onClick={handleSubmit}>
                                <Save />
                                <span>Publish</span>
                            </Button>
                        </DialogContent>
                    </Dialog>
                </header>
                <div className="flex flex-col gap-10 mt-10 sm:mt-20">
                    {currentQuestion && (
                        <div key={currentQuestion.id} className="flex flex-col gap-10 items-center">
                            <Input className="w-1/2 md:w-1/3" placeholder="Question text..." value={currentQuestion.text} onChange={(e) => updateQuestionText(currentQuestion.id, e.target.value)} />
                            <div className="grid grid-cols-1 gap-5 w-3/4 md:w-1/2">
                                {currentQuestion.options.map((option, index) => (
                                    <div key={index} className="flex items-center justify-center gap-2">
                                        <Input className="w-2/3" placeholder={`Option ${index + 1}`} value={option.text} onChange={(e) => updateOption(currentQuestion.id, index, e.target.value)} />
                                        <Input className="w-6 h-6 caret-green-500 bg-green-500 cursor-pointer" type="radio" name={`correct-${currentQuestion.id}`} checked={option.isCorrect} onChange={() => setCorrectOption(currentQuestion.id, index)} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <Pagination>
                        <PaginationContent className="flex flex-wrap justify-center gap-2">
                            {questions.map((question) => (
                                <ContextMenu key={question.id}>
                                    <ContextMenuTrigger key={question.id}>
                                        <PaginationItem onClick={() => setCurrentQuestionId(question.id)} className={`cursor-pointer ${currentQuestionId === question.id ? "bg-primary text-background rounded-lg" : ""}`}>
                                            <PaginationLink>{question.id}</PaginationLink>
                                        </PaginationItem>
                                    </ContextMenuTrigger>
                                    <ContextMenuContent>
                                        <ContextMenuItem onClick={() => deleteQuestion(question.id)} className="text-red-500 cursor-pointer bg-red-800 duration-200">
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
    ) :
        (
            <div className="flex flex-col items-center justify-center py-20 gap-5">
                <h1 className="text-4xl font-bold">You need to be logged in to create a quiz</h1>
                <p className="text-lg text-gray-500">Please log in to continue</p>
                <Button onClick={() => navigate("/")}>
                    <span>Go to Home</span>
                </Button>
            </div>
        )
}

export default Create
