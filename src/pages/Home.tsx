import { useSelector } from "react-redux"
import type { RootState } from "../app/store"
import { useNavigate } from "react-router-dom"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { toast } from "sonner"

function Home() {
    const quizList = useSelector((state: RootState) => state.quizList.filteredQuizzes)
    const user = useSelector((state: RootState) => state.quizList.user)
    const navigate = useNavigate()

    return (
        <section className="mt-8">
            <div className="max-container flex flex-col gap-5">
                <h1 className="font-bold text-4xl">Quizes</h1>
                <Carousel opts={{
                    align: "start",
                }}>
                    {quizList.length ?
                        <>
                            <CarouselContent>
                                {
                                    [...quizList].reverse().map(quiz => (
                                        <CarouselItem key={quiz.id} className="basis-1/5">
                                            <img className="rounded-2xl" src={quiz.poster instanceof File ? URL.createObjectURL(quiz.poster) : quiz.poster || "/no-image.png"} alt="" /><span>{quiz.title}</span>
                                        </CarouselItem>
                                    ))
                                }
                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                        </> :
                        <div className="flex flex-col items-start gap-2 text-neutral-400">
                            <span>You have no quizes yet :(</span>
                            <button onClick={() => {
                                user ?
                                    navigate("/create") :
                                    toast("You must log in first")
                            }} className="underline hover:text-foreground">Create one</button>
                        </div>}
                </Carousel>
            </div>
        </section>
    )
}

export default Home
