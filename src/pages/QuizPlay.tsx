import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Separator } from "@/components/ui/separator"
import type { Question } from "@/types"
import { doc, getDoc, getFirestore, QueryDocumentSnapshot, type DocumentData } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"

const QuizPlay = () => {
    const [quiz, setQuiz] = useState<QueryDocumentSnapshot<DocumentData, DocumentData> | null>(null);
    const questions: Question[] = quiz?.data().questions || []
    const [currentQuestionId, setCurrentQuestionId] = useState(1)
    const currentQuestion = questions.find((q: Question) => q.id === currentQuestionId)
    const { id } = useParams();
    const db = getFirestore();
    const [finished, setFinished] = useState(false)

    const [playInput, setPlayInput] = useState<{ [key: number]: number }>({})

    const navigate = useNavigate()

    useEffect(() => {
        const fetchProduct = async () => {
            const docRef = doc(db, "quizList", id as string);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setQuiz(docSnap);
            } else {
                console.log("No such document!");
            }
        };

        fetchProduct();
    }, [id]);

    const Results = () => {
        let correctAnswers = [] as any

        questions.forEach((question) => {
            if (!playInput[question.id]) {
                return
            } else if (question.options[playInput[question.id]].isCorrect) {
                correctAnswers.push(question)
            }
        })

        return (
            <div className="flex flex-col gap-5 items-center">
                <h1 className="font-bold text-2xl">Results</h1>
                <div className="flex flex-col gap-2 items-center">
                    <h3>Your score</h3>
                    <p>{correctAnswers.length} out of {questions.length}</p>
                </div>
                <Button onClick={() => navigate("/")}>Back to quizzes</Button>
            </div>
        )
    }

    const handleFinish = () => {
        if (Object.keys(playInput).length !== questions.length) {
            toast(`You have ${questions.length - Object.keys(playInput).length} questions left to answer`, {
                action: {
                    label: "Finish Quiz",
                    onClick: () => setFinished(true)
                }
            })
        } else {
            setFinished(true)
        }
    }

    return (
        quiz ? (
        <>
            {finished && (
                <Card className="scale-125 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-10 shadow-lg rounded-lg z-50 bg-background">
                    <Results />
                </Card>
            )}
            <div className="max-container flex flex-col gap-10">
                <div className="flex w-full justify-between">
                    <h2 className="font-semibold text-neutral-400 text-2xl text-start">{quiz?.data().title}</h2>
                    <div className="flex flex-col gap-2">
                        <p>Answered: {Object.keys(playInput).length}/{questions.length}</p>
                        <Button onClick={handleFinish} variant="secondary">Finish</Button>
                    </div>
                </div>
                <div className="flex flex-col gap-20">
                    {currentQuestion && (
                        <div key={currentQuestion.id} className="flex flex-col gap-10 items-center">
                            <h1 className="font-semibold text-2xl text-center">{currentQuestion.text}</h1>
                            <div className="grid grid-cols-1 gap-5 w-5/6 md:w-2/3 lg:w-1/2">
                                {currentQuestion.options?.map((option, index) => (
                                    <div key={index} className="flex flex-col gap-4">
                                        <div className="flex items-center justify-between gap-2">
                                            <Label htmlFor={option.text} className={"text-lg grow text-neutral-" + (playInput[currentQuestion.id] === index ? "0" : "400")}>{option.text}</Label>
                                            <Input className="w-6 h-6 caret-green-500 bg-green-500 cursor-pointer" type="radio" id={option.text} name={`correct-${currentQuestion.id}`} onChange={() => setPlayInput(prev => ({ ...prev, [currentQuestion.id]: index }))} value={playInput[currentQuestion.id] ?? ""} checked={playInput[currentQuestion.id] === index} />
                                        </div>
                                        <Separator />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <Pagination>
                        <PaginationPrevious className={currentQuestionId === 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} onClick={() => {
                            currentQuestionId === 1 || setCurrentQuestionId(prev => prev -= 1)}
                        } />
                        <PaginationContent className="flex flex-wrap gap-2">
                            {questions.map((question) => (
                                <ContextMenu key={question.id}>
                                    <ContextMenuTrigger key={question.id}>
                                        <PaginationItem onClick={() => setCurrentQuestionId(question.id)} className={`cursor-pointer ${currentQuestionId === question.id ? "bg-primary text-background rounded-lg" : ""}`}>
                                            <PaginationLink>{question.id}</PaginationLink>
                                        </PaginationItem>
                                    </ContextMenuTrigger>
                                </ContextMenu>
                            ))}
                        </PaginationContent>
                        <PaginationNext className={currentQuestionId === questions.length ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} onClick={() => {
                            currentQuestionId === questions.length || setCurrentQuestionId(prev => prev += 1)}
                        } />
                    </Pagination>
                </div>
            </div>
        </>) : (
            <img className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32" src="/loading.gif" alt="" />
        )
    )
}

export default QuizPlay