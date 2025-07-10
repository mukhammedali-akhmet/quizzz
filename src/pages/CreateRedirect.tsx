import { db } from '@/lib/firebase'
import { getAuth } from 'firebase/auth'
import { addDoc, collection } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const CreateRedirect = () => {
    const auth = getAuth();
    const navigate = useNavigate()



    const [draftId, setDraftId] = useState("");


    useEffect(() => {
        if (!auth.currentUser?.uid) {
            toast.error("You need to login to create quizzes!")
            navigate("/login")
        } else {
            const createDraft = async (): Promise<void> => {
                try {
                    const doc = await addDoc(collection(db, "drafts"), {
                        title: "",
                        description: "",
                        category: "",
                        tags: [],
                        coverURL: "",
                        plays: 0,
                        questions: [],
                        author: auth.currentUser?.email
                    });
                    setDraftId(doc.id)
                    console.log(doc.id)
                } catch (error: unknown) {
                    if (error instanceof Error) {
                        toast.error(error.message);
                    } else {
                        toast.error(String(error));
                    }
                }
            }

            createDraft()
        }
    }, [])

    useEffect(() => {
        draftId && navigate(`/drafts/${draftId}`)
    }, [draftId])

    return (
        <div className="w-full h-[10vw] flex items-center justify-center">
            <img src="/loading.gif" alt="" />
        </div>
    )
}

export default CreateRedirect