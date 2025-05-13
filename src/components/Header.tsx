import { Link, useLocation, useNavigate } from 'react-router-dom'
import { CgProfile } from 'react-icons/cg'
import { Moon, Plus, Sun } from 'lucide-react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
import { useTheme } from './theme-provider'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '@/app/store'
import { toggleModal } from '@/features/modal/modalSlice'
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { setSearchTerm } from '@/features/search/searchSlice'
import { signOutUser } from '@/features/user/userSlice'

const Header = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const user = useSelector((state: RootState) => state.user)

    const { setTheme } = useTheme()

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            dispatch(signOutUser());
        } catch (error) {
            if (error instanceof Error) {
                console.error("Google Sign-in error:", error.message);
            } else {
                console.error("Google Sign-in error:", error);
            }
        }
    };

    const term = useSelector((state: RootState) => state.search.term);
    const location = useLocation()

    return (
        <header className="fixed top-5 left-0 right-0 z-50">
            <div className="max-container px-8 flex items-center justify-between bg-background/75 backdrop-blur-sm  border rounded-4xl border-muted-foreground/20 py-3">
                <Link to="/" className="flex items-center gap-2">
                    <img className="w-12" src="/quizzz.png" alt="" />
                    <span className='text-primary font-bold text-3xl'>Quizzz</span>
                </Link>
                <div className="flex gap-4 items-center">
                    {location.pathname === "/" && (
                        <Input value={term} onChange={(e) => dispatch(setSearchTerm(e.target.value))} placeholder="Search for quizzzes..." />
                    )}
                    <Button onClick={() => {
                        user ?
                            navigate("/create") :
                            dispatch(toggleModal())
                    }}>
                        <Plus size={30} strokeWidth={4} />
                        <span>Create Quiz</span>
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild className='flex items-center'>
                            <Button variant="outline" size="icon">
                                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                <span className="sr-only">Toggle theme</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setTheme("light")}>
                                Light
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("dark")}>
                                Dark
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("system")}>
                                System
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <div className='flex items-center'>
                        {user.username ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger className='flex items-center justify-center w-9 h-9'>
                                    <img className='w-9 h-9 rounded-full' src={user.photoURL} alt="" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className='w-20'>
                                    <DropdownMenuLabel className="whitespace-nowrap text-ellipsis">Welcome, {user.name}</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleSignOut} className='text-red-500'>Sign Out</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                        ) : (
                            <Button className='w-9' variant="outline" onClick={() => dispatch(toggleModal())}>
                                <CgProfile />
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header