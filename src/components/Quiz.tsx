import { Button } from './ui/button'
import { Play, Trash } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Skeleton } from './ui/skeleton'
import { useState } from 'react'

const Quiz = ({
    userUid,
    uid,
    id,
    title,
    posterUrl,
    deleteDocument
}: {
    userUid: string
    uid: string
    id: string
    title: string
    posterUrl: string
    deleteDocument: (id: string) => void
}) => {
    const navigate = useNavigate()
    const [hovered, setHovered] = useState(false)
    return (
        <div onMouseOver={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
            {userUid === uid && hovered && (
                <Button onClick={() => deleteDocument(id)} className="absolute top-2 right-2 bg-red-500 text-white hover:bg-red-600 rounded-full p-1">
                    <Trash size={5} />
                </Button>
            )}
            <img className="rounded-2xl w-full h-36 object-cover" src={posterUrl} alt="" />
            <div className="flex flex-col gap-3 mt-1">
                <span className="font-bold text-xl">{title}</span>
                <Button variant="outline" onClick={() => navigate(`/quiz/${id}`)}>
                    <Play size={20} />
                    <span className="ml-2">Play</span>
                </Button>
            </div>
        </div>
    )
}

export const QuizSkeleton = () => {
    return (
        <>
            <Skeleton className="rounded-2xl w-full h-36" />
            <div className="flex flex-col gap-3">
                <Skeleton className="rounded-md w-1/2 h-4" />
                <Skeleton className="rounded-md w-full h-8" />
            </div>
        </>
    )
}

export default Quiz