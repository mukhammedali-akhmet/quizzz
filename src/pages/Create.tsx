import { iconTriggerClass } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import { db } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import type { Question, Quiz } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { TooltipContent } from "@radix-ui/react-tooltip";
import { getAuth } from "firebase/auth";
import { addDoc, collection, deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { Check, GripVertical, Plus, Settings, Trash, X } from "lucide-react";
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form";
import { FaQuestion } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { v4 as uuid } from "uuid"

const quizCategories = [
    "Education",
    "Entertainment",
    "Lifestyle",
    "Culture",
    "Technology",
    "Health",
    "Business",
    "Science",
    "Society",
    "History"
];

const quizSchema = z.object({
    title: z.string().min(1, { message: "Please enter a title of the quiz." }),
    description: z.string()
});

type quizData = z.infer<typeof quizSchema>

// const questionSchema = z.object({
//     title: z.string().min(1, { message: "Please enter a title of a question or delete it." }),
//     options: z.array(
//         z.object({
//             label: z.string().min(1, { message: "Please enter an option of a question or delete the question." }),
//             isCorrect: z.boolean()
//         })
//     ).min(2, { message: "Each question must have at least two options." })
// });

const Create = () => {
    const quizForm = useForm<quizData>({
        resolver: zodResolver(quizSchema),
    });

    const { id } = useParams();
    const [isOwner, setIsOwner] = useState(false);
    const [lastSaved, setLastSaved] = useState(0);
    const [category, setCategory] = useState("")
    const [quiz, setQuiz] = useState<null | Quiz>(null)
    const auth = getAuth()
    const [_typeSwitchedIndex, setTypeSwitchedIndex] = useState<number>(0)
    const navigate = useNavigate()


    const generateLastSavedTime = () => {
        if (lastSaved / 60 < 1) {
            return "just now"
        } else if (lastSaved / 60 >= 1 && lastSaved / 60 <= 2) {
            return "a minute ago"
        } else {
            return `${(lastSaved / 60).toFixed(0)} minutes ago`
        }
    }

    const [savingStatus, setSavingStatus] = useState<"not-saved" | "saved" | "loading">("not-saved");
    const generateSavingStatus = () => {
        switch (savingStatus) {
            case "saved":
                return "Saved " + generateLastSavedTime()
            case "loading":
                return "Saving"
            default:
                break;
        }
    };

    const addNewQuestion = () => {
        setQuestions([...questions, {
            id: uuid(),
            title: "Untitled Question",
            type: "single",
            options: [
                {
                    label: "Option 1",
                    isCorrect: false
                },
                {
                    label: "Option 2",
                    isCorrect: false
                },
                {
                    label: "Option 3",
                    isCorrect: false
                },
                {
                    label: "Option 4",
                    isCorrect: false
                },
            ]
        }])
        toast("New question was added")
    }

    const createQuiz = async () => {
        try {
            await addDoc(collection(db, "quizzes"), {
                ...quiz
            })
            await deleteDoc(doc(db, "quizzes", id as string))
            toast("Quiz was created")
            navigate("/")
        } catch (error) {
            toast.error(error as string)

        }
    }

    const [questions, setQuestions] = useState<Question[]>([{
        id: uuid(),
        title: "Untitled Question",
        type: "multiple",
        options: [
            {
                label: "Option 1",
                isCorrect: false
            },
            {
                label: "Option 2",
                isCorrect: false
            },
            {
                label: "Option 3",
                isCorrect: false
            },
            {
                label: "Option 4",
                isCorrect: false
            },
        ]
    }])
    const [tags, setTags] = useState<string[]>([])
    const [tagInput, setTagInput] = useState("")

    useEffect(() => {
        const checkOwner = async () => {
            const docRef = doc(db, "drafts", id as string)
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                if (docSnap.data().author === auth.currentUser?.email) {
                    setIsOwner(true)
                }
            }
        }

        checkOwner()
    }, [id, auth.currentUser, db])

    useEffect(() => {
        const getCurrentData = async () => {
            const docRef = doc(db, "drafts", id as string)
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                const data = docSnap.data()
                setQuiz(data as Quiz)
                quizForm.setValue("title", data.title)
                quizForm.setValue("description", data.description)
                setTags(data.tags)
                setQuestions(data.questions)
                setCategory(data.category)
            }
        }

        getCurrentData()
    }, [])

    useEffect(() => {
        const updateTitle = async () => {
            setSavingStatus("loading")
            try {
                const docRef = doc(db, "drafts", id as string)
                await updateDoc(docRef, {
                    title: quizForm.watch("title"),
                    description: quizForm.watch("description"),
                    category: category,
                    tags: tags
                })
                setSavingStatus("saved")
            } catch (error) {
                toast.error(error as string)
            }
        }

        updateTitle()
    }, [quizForm.watch("title"), quizForm.watch("description"), category, tags])

    useEffect(() => {
        const updateQuestions = async () => {
            setSavingStatus("loading")
            try {
                const docRef = doc(db, "drafts", id as string)
                await updateDoc(docRef, {
                    questions: questions
                })
                setSavingStatus("saved")
            } catch (error) {
                toast.error(error as string)
            }
        }

        updateQuestions()
    }, [questions])

    useEffect(() => {
        let interval: number | undefined;
        if (savingStatus === "saved") {
            interval = window.setInterval(() => setLastSaved(prev => prev + 1), 200);
        }
        return () => {
            if (interval !== undefined) clearInterval(interval);
            setLastSaved(0)
        };
    }, [savingStatus]);

    useEffect(() => {
        if (tagInput.includes(",")) {
            const newTags = tagInput
                .split(",")
                .map(tag => tag.trim())
                .filter(tag => tag.length > 0);
            setTags([...tags, ...newTags]);
            setTagInput("");
        }
    }, [tagInput]);

    return isOwner ? (
        <section className="mt-25">
            <div className="max-container flex flex-col gap-7">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold">Create a new quizz</h2>
                        <p>{generateSavingStatus()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Dialog>
                            <DialogTrigger className={cn(iconTriggerClass, "text-neutral-400")}>
                                <Settings />
                            </DialogTrigger>
                            <DialogContent className="flex flex-col items-center gap-5">
                                <DialogHeader >
                                    <DialogTitle className="text-center">Setting of the Quizzz</DialogTitle>
                                </DialogHeader>
                                <div className="flex flex-col gap-7">
                                    <Select value={category} onValueChange={setCategory}>
                                        <SelectTrigger>
                                            <Label className="text-foreground">Category</Label>
                                            <SelectValue placeholder="Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {quizCategories.map(cat => (
                                                <SelectItem value={cat} key={cat}>{cat}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <div className="flex flex-col items-center gap-3">
                                        <Label className="self-start">
                                            Tags
                                            <Tooltip>
                                                <TooltipTrigger className="text-neutral-400">
                                                    <FaQuestion />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p className="text-neutral-400 pb-2">For search</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </Label>
                                        <div className="flex gap-2 flex-wrap w-100">
                                            {tags.map((tag, index) => (
                                                <div key={index} className="flex items-center gap-1 text-neutral-400 rounded-md bg-neutral-900 py-2 px-4 ">
                                                    <span className="text-sm text-neutral-400">{tag}</span>
                                                    <button onClick={() => setTags(tags.filter((_tag, i) => i !== index))}>
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        <Input className="w-full" placeholder="Add comas , between tags" value={tagInput} onChange={(e) => setTagInput(e.target.value)} />
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                        <Button disabled={savingStatus === "loading"} onClick={() => createQuiz()}>Create</Button>
                    </div>
                </div>
                <Separator />
                <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="quiz-title">Title</Label>
                        <Input
                            placeholder='Type something like "Geometry: triangles"'
                            id="quiz-title"
                            {...quizForm.register("title")}
                            className={cn(quizForm.formState.errors.title && "border-red-500")}
                        />
                        {quizForm.formState.errors.title && (
                            <p className="text-sm text-red-500">{quizForm.formState.errors.title.message}</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="quiz-description">Description</Label>
                        <Input
                            placeholder="Add a description... (optional)"
                            id="quiz-description"
                            {...quizForm.register("description")}
                            className={cn((quizForm.formState.errors.description && "border-red-500"), "pt-5 pb-10")}
                        />
                        {quizForm.formState.errors.description && (
                            <p className="text-sm text-red-500">{quizForm.formState.errors.description.message}</p>
                        )}
                    </div>
                    <Button className="self-end" onClick={() => addNewQuestion()} variant="link">
                        <Plus />
                        <span>Add question</span>
                    </Button>
                    <div className="flex flex-col gap-4">
                        {questions.map((question, index) => (
                            <div className="flex flex-col gap-3 border pt-3 pb-6 px-5 rounded-md" key={question.id}>
                                <div className="flex items-center justify-between ">
                                    <p>{index + 1}.</p>
                                    <div className="flex items-center gap-2 text-neutral-400">
                                        <Button variant="ghost" size="icon" className="cursor-grab">
                                            <GripVertical />
                                        </Button>
                                        <Button
                                            onClick={() => setQuestions(questions.filter(q => q.id !== question.id))}
                                            disabled={questions.length === 1}
                                            variant="ghost"
                                            size="icon"
                                            className="hover:text-red-400"
                                        >
                                            <Trash />
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-5 items-center">
                                    <div className="flex flex-col gap-5 items-center w-3/4">
                                        <div className="flex flex-col gap-2 w-full">
                                            <Input
                                                placeholder={`Type Question ${index + 1}`}
                                                value={question.title || ""}
                                                onChange={e => {
                                                    setQuestions(prevQuestions => {
                                                        const updatedQuestions = [...prevQuestions];
                                                        updatedQuestions[index] = {
                                                            ...updatedQuestions[index],
                                                            title: e.target.value
                                                        };
                                                        return updatedQuestions;
                                                    });
                                                }}
                                            />
                                            {/* {!question.title && (
                                                <p className="text-sm text-red-500">Please enter a title of a question or delete it.</p>
                                            )} */}
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 w-8/9">
                                            {(question.options || []).map((option, optionIdx) => (
                                                <div key={optionIdx + 1} className="flex items-center gap-2">
                                                    <Button
                                                        onClick={() => {
                                                            if (question.type && question.type.toLocaleLowerCase() === "multiple") {
                                                                setQuestions(prevQuestions => {
                                                                    const updatedQuestions = [...prevQuestions];
                                                                    updatedQuestions[index] = {
                                                                        ...updatedQuestions[index],
                                                                        options: updatedQuestions[index].options.map((opt, idx) =>
                                                                            idx === optionIdx
                                                                                ? { ...opt, isCorrect: !opt.isCorrect }
                                                                                : opt
                                                                        ),
                                                                    }
                                                                    return updatedQuestions;
                                                                });
                                                            } else {
                                                                setQuestions(prevQuestions => {
                                                                    const updatedQuestions = [...prevQuestions];
                                                                    updatedQuestions[index] = {
                                                                        ...updatedQuestions[index],
                                                                        options: updatedQuestions[index].options.map((opt, idx) =>
                                                                            idx === optionIdx
                                                                                ? { ...opt, isCorrect: true }
                                                                                : { ...opt, isCorrect: false }
                                                                        ),
                                                                    }
                                                                    return updatedQuestions;
                                                                });
                                                            }
                                                        }}
                                                        className={cn(option.isCorrect ? "text-green-400" : "text-neutral-400")}
                                                        size="icon"
                                                        variant="outline"
                                                    >
                                                        <Check />
                                                    </Button>
                                                    <Input
                                                        placeholder={`Option ${optionIdx + 1}`}
                                                        value={option.label || ""}
                                                        onChange={(e) => {
                                                            setQuestions(prevQuestions => {
                                                                const updatedQuestions = [...prevQuestions];
                                                                updatedQuestions[index] = {
                                                                    ...updatedQuestions[index],
                                                                    options: updatedQuestions[index].options.map((opt, idx) =>
                                                                        idx === optionIdx
                                                                            ? { ...opt, label: e.target.value }
                                                                            : opt
                                                                    ),
                                                                };
                                                                return updatedQuestions;
                                                            });
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        {/* {question.options && question.options.some(opt => !opt.label) && (
                                            <p className="text-sm text-red-500">Please enter an option of a question or delete the question.</p>
                                        )} */}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 w-1/3 mt-10">
                                    <Button
                                        size="sm"
                                        onClick={() => setQuestions(prevQuestions => {
                                            const updatedQuestions = [...prevQuestions];
                                            updatedQuestions[index] = {
                                                ...updatedQuestions[index],
                                                type: "multiple"
                                            };
                                            setTypeSwitchedIndex(index)
                                            return updatedQuestions;
                                        })}
                                        variant={question.type && question.type.toLocaleLowerCase() === "multiple" ? "default" : "outline"}
                                        className="rounded-r-none"
                                    >
                                        Multiple
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={() => setQuestions(prevQuestions => {
                                            const updatedQuestions = [...prevQuestions];
                                            updatedQuestions[index] = {
                                                ...updatedQuestions[index],
                                                type: "single"
                                            };
                                            setTypeSwitchedIndex(index)
                                            return updatedQuestions;
                                        })}
                                        variant={question.type && question.type.toLocaleLowerCase() === "single" ? "default" : "outline"}
                                        className="rounded-l-none"
                                    >
                                        Single
                                    </Button>
                                </div>
                            </div>
                        ))}
                        <Button onClick={() => addNewQuestion()} variant="link">
                            <Plus />
                            <span>Add question</span>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    ) : <div className="w-full h-[10vw] flex items-center justify-center">
        <img src="/loading.gif" alt="" />
    </div>
}

export default Create