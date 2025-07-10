import { useEffect, useState } from "react"
import { collection, onSnapshot, query, QueryDocumentSnapshot, type DocumentData } from "firebase/firestore"
import { db } from "@/lib/firebase"

function Home() {
    const [quizzes, setQuizzes] = useState<QueryDocumentSnapshot<DocumentData, DocumentData>[]>([])

    useEffect(() => {
        const q = query(
            collection(db, "quizzes")
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const snapshotDocs = snapshot.docs;
            setQuizzes(snapshotDocs);
        });

        return unsubscribe;
    }, []);

    console.log(quizzes)

    return (
        <section className="mt-8">
            <div className="max-container flex flex-col gap-7">
                <h1 className="font-bold text-4xl">Quizzes</h1>
                <ul className="flex gap-10">
                    {quizzes.map(quiz => (
                        <li key={quiz.id}>
                            <h1 className="text-2xl font-bold">{quiz.data().title}</h1>
                            <p>{quiz.data().description}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    )
}

export default Home