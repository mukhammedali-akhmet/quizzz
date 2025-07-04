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
            </div>
        </section>
    )
}

export default Home