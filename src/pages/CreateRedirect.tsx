import { db } from '@/lib/firebase'
import type { CustomUser } from '@/types'
import { getAuth } from 'firebase/auth'
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

const CreateRedirect = () => {
    const { currentUser } = getAuth()
    const [user, setUser] = useState<null | CustomUser>(null)

    useEffect(() => {
        const getUser = async () => {
            const q = query(collection(db, "users"), where("email", "==", currentUser?.email))
            const querySnapshot = await getDocs(q);
            if (querySnapshot.empty) {
                toast("You can't create a quiz without authorization")
                console.log("18")
            } else {
                setUser(querySnapshot.docs[0].data() as CustomUser)
                console.log(user?.username)
            }
        }

        getUser()

        const createDraft = async () => {
            try {
                const doc = await addDoc(collection(db, "drafts"), {
                    title: "",
                    description: "",
                    questions: [
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
                    ],
                    category: "",
                    coverURL: "",
                    plays: 0,
                    username: user?.username
                })
                console.log(doc.id)
            } catch (error) {

            }
        }

        createDraft()
    }, [])

    return (
        <div className="w-full h-[50vw] flex items-center justify-center">
            <img src="/loading.gif" alt="" />
        </div>
    )
}

export default CreateRedirect