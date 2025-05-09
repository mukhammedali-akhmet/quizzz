import { Link, useNavigate } from 'react-router-dom'
import { Input } from './ui/input'
import { CgGoogle, CgProfile } from 'react-icons/cg'
import { Plus } from 'lucide-react'
import { Button } from './ui/button'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import type { AppDispatch, RootState } from '@/app/store'
import { logIn, logOut, searchQuizes } from '@/features/quizList/quizListSlice'
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { toast } from 'sonner'

const Header = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const [searchText, setSearchText] = useState("")
    const user = useSelector((state: RootState) => state.quizList.user)

    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user
            dispatch(logIn(user))
        } catch (error) {
            if (error instanceof Error) {
                console.error("Google Sign-in error:", error.message);
            } else {
                console.error("Google Sign-in error:", error);
            }
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            dispatch(logOut())
        } catch (error) {
            if (error instanceof Error) {
                console.error("Google Sign-in error:", error.message);
            } else {
                console.error("Google Sign-in error:", error);
            }
        }
    };

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
                    <Button onClick={() => {
                        user ? 
                            navigate("/create") :
                            toast("You must log in first")
                    }}>
                        <Plus size={30} strokeWidth={4} />
                        <span>Create Quiz</span>
                    </Button>
                    <div>
                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger className='flex items-center justify-center'>
                                    <img className='w-[65px] rounded-full' src={user.photoURL ?? ""} alt="" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>Welcome, {user.displayName}</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout} className='text-red-500'>Log Out</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                        ) : (
                            <Dialog>
                                <DialogTrigger><CgProfile size={35} /></DialogTrigger>
                                <DialogContent>
                                    <DialogHeader className='flex flex-col gap-5 items-center'>
                                        <DialogTitle className='text-2xl'>Welcome to Quizzz</DialogTitle>
                                        <DialogDescription>
                                            <Button onClick={signInWithGoogle}>
                                                <CgGoogle />
                                                <span>Log in with Google</span>
                                            </Button>
                                        </DialogDescription>
                                    </DialogHeader>
                                </DialogContent>
                            </Dialog>
                        )}
                    </div>

                </div>
            </div>
        </header>
    )
}

export default Header