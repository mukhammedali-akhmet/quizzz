import { useSelector } from "react-redux"
import type { RootState } from "../app/store"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { useEffect, useState } from "react"
import { collection, deleteDoc, doc, onSnapshot, query, QueryDocumentSnapshot, type DocumentData } from "firebase/firestore"
import { db } from "@/lib/firebase"
import Quiz, { QuizSkeleton } from "@/components/Quiz"

function Home() {
    const [quizzes, setQuizzes] = useState<QueryDocumentSnapshot<DocumentData, DocumentData>[]>([])
    const user = useSelector((state: RootState) => state.user)
    const searchTerm = useSelector((state: RootState) => state.search.term);

    async function deleteDocument(documentId: string) {
        try {
            const docRef = doc(db, "quizList", documentId);
            await deleteDoc(docRef);
            console.log(`Document with ID ${documentId} deleted successfully.`);
        } catch (error) {
            console.error("Error deleting document:", error);
        }
    }

    useEffect(() => {
        const q = query(
            collection(db, "quizList"),
        )
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const snapshotDocs = snapshot.docs;
            setQuizzes(snapshotDocs)
        })

        return unsubscribe
    }, [])

    const filteredItems = quizzes.filter(quiz =>
        quiz.data().title.toLowerCase().includes(searchTerm.toLowerCase()),
        console.log(quizzes)
    );

    return (
        <section className="mt-8">
            <div className="max-container flex flex-col gap-7">
                <h1 className="font-bold text-4xl">Quizzes</h1>
                <Carousel opts={{
                    align: "start",
                }}>
                    <CarouselContent>
                        {quizzes.length !== 0 ?
                            [...filteredItems].reverse().map(quiz => (
                                <CarouselItem key={quiz.id} className="basis-1/2 sm:basis-1/3 lg:basis-1/5 2xl:basis-1/6 relative flex flex-col gap-3">
                                    <Quiz
                                        id={quiz.id}
                                        uid={quiz.data().uid}
                                        title={quiz.data().title}
                                        posterUrl={quiz.data().posterUrl}
                                        userUid={user?.uid}
                                        deleteDocument={deleteDocument}
                                    />
                                </CarouselItem>
                            )) : (
                                new Array(5).fill(0).map((_, index) => (
                                    <CarouselItem key={index} className="basis-1/2 sm:basis-1/3 lg:basis-1/5 2xl:basis-1/6 relative flex flex-col gap-3">
                                        <QuizSkeleton />
                                    </CarouselItem>
                                ))
                            )
                        }
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>
        </section>
    )
}

export default Home