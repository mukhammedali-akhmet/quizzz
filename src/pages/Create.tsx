import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDoc, collection } from "firebase/firestore";
import { GripVertical, Trash } from "lucide-react";
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form";
import { z } from "zod";

const quizSchema = z.object({
    title: z.string().min(1, { message: "Please enter a title of the quiz." }),
    description: z.string()
});

type quizData = z.infer<typeof quizSchema>

const questionSchema = z.object({
    title: z.string().min(1, { message: "Please enter a title of a question or delete it." }),
    option: z.string().min(1, { message: "Please enter an option of a question or delete the question." })
});

type questionData = z.infer<typeof questionSchema>

const Create = () => {
    const quizForm = useForm<quizData>({
        resolver: zodResolver(quizSchema),
    });

    const questionForm = useForm<questionData>({
        resolver: zodResolver(questionSchema),
    });

    const [savingStatus, setSavingStatus] = useState<"not-saved" | "saved" | "loading">("not-saved");
    const generateSavingStatus = () => {
        switch (savingStatus) {
            case "saved":
                return "Saved just now"
            case "loading":
                return "Saving"
            default:
                break;
        }
    };

    const [questions, setQuestions] = useState([
        {
            title: "",
            type: "Multiple",
            options: [
                {
                    label: "",
                    isCorrect: false
                },
                {
                    label: "",
                    isCorrect: false
                },
                {
                    label: "",
                    isCorrect: false
                },
                {
                    label: "",
                    isCorrect: false
                },
            ]
        }
    ])

    useEffect(() => {
        const createDraft = async () => {
            try {
                const doc = await addDoc(collection(db, "drafts"), {
                    title: quizForm.watch("title"),
                    description: quizForm.watch("description"),

                })
                console.log(doc.id)

                setSavingStatus("saved")
            } catch (error) {

            } finally {
                setSavingStatus("not-saved")
            }
        }

        createDraft()
    }, [])

    useEffect(() => {
        const saveDraft = async () => {
            setSavingStatus("loading")
            try {
                await addDoc(collection(db, "drafts"), {
                    title: quizForm.watch("title"),
                    description: quizForm.watch("description"),

                })
                setSavingStatus("saved")
            } catch (error) {

            } finally {
                setSavingStatus("not-saved")
            }
        }

        saveDraft()
    }, [quizForm.watch("title"), quizForm.watch("description"), questionForm.watch("title"), questionForm.watch("option"), ...questions])

    return (
        <section className="mt-25">
            <div className="max-container flex flex-col gap-7">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold">Create a new quizz</h2>
                        <p>{generateSavingStatus()}</p>
                    </div>
                    <Button onClick={() => { }}>Create</Button>
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
                </div>
                <div className="flex flex-col gap-4">
                    {questions.map((question, index) => (
                        <div className="flex flex-col gap-3 border pt-3 pb-6 px-5 rounded-md" key={index + 1}>
                            <div className="flex items-center justify-between ">
                                <p>{index + 1}.</p>
                                <div className="flex items-center gap-2 text-neutral-400">
                                    <Button variant="ghost" size="icon" className="cursor-grab">
                                        <GripVertical />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="hover:text-red-400">
                                        <Trash />
                                    </Button>
                                </div>
                            </div>
                            <div className="flex flex-col gap-5 items-center">
                                <div className="flex flex-col gap-5 items-center w-3/4">
                                    <div className="flex flex-col gap-2 w-full">
                                        <Input
                                            placeholder={`Type Question ${index + 1}`}
                                            {...questionForm.register("title")}
                                            className={cn(questionForm.formState.errors.title && "border-red-500")}
                                        />
                                        {questionForm.formState.errors.title && (
                                            <p className="text-sm text-red-500">{questionForm.formState.errors.title.message}</p>
                                        )}
                                        {questionForm.formState.errors.option && (
                                            <p className="text-sm text-red-500">{questionForm.formState.errors.option.message}</p>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 w-8/9">
                                        {question.options.map((option, optionIdx) => (
                                            <Input
                                                key={optionIdx + 1}
                                                placeholder={`Option ${optionIdx + 1}`}
                                                value={option.label}
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
                                                className={cn(questionForm.formState.errors.option && "border-red-500")}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Create