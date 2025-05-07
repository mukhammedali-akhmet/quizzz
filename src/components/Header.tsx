import { Link, useNavigate } from 'react-router-dom'
import { Input } from './ui/input'
import { CgProfile } from 'react-icons/cg'
import { Plus } from 'lucide-react'
import { Button } from './ui/button'
import { useDispatch } from 'react-redux'
import { useState } from 'react'
import type { AppDispatch } from '@/app/store'
import { searchQuizes } from '@/features/quizList/quizListSlice'

const Header = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const [searchText, setSearchText] = useState("")

    dispatch(searchQuizes(searchText))
    return (
        <header className="fixed top-5 left-0 right-0 z-50">
            <div className="max-container px-8 flex items-center justify-between bg-background/75 backdrop-blur-sm shadow-2xl border rounded-4xl border-muted-foreground/20 py-3">
                <Link to="/" className="flex items-center gap-2">
                    <img className="w-12" src="/quizzz.png" alt="" />
                    <span className='text-primary font-bold text-3xl'>Quizzz</span>
                </Link>
                <div className="flex gap-4 items-center">
                    <Input value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Search for quizzzes..." />
                    <Button onClick={() => navigate("/create")}>
                        <Plus size={30} strokeWidth={4} className="text-foreground" />
                        <span className='text-foreground'>Create Quiz</span>
                    </Button>
                    <button>
                        <CgProfile size={35} className="text-input hover:text-muted-foreground duration-200 cursor-pointer shadow-none ring-0" />
                    </button>
                </div>
            </div>
        </header>
    )
}

export default Header