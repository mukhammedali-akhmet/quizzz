import { Link, useLocation, useNavigate } from 'react-router-dom'
import { CgProfile } from 'react-icons/cg'
import { Moon, OctagonAlert, Plus, Search, Sun } from 'lucide-react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
import { useTheme } from './theme-provider'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '@/app/store'
import { getAuth, onAuthStateChanged, signOut, type User } from "firebase/auth";
import { setSearchTerm } from '@/features/search/searchSlice'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { Dialog, DialogContent } from './ui/dialog'
import { DialogTrigger } from '@radix-ui/react-dialog'

const Header = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const auth = getAuth()

    const { setTheme } = useTheme()

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            navigate("/login")
        } catch (error) {
            if (error instanceof Error) {
                console.error("Google Sign-in error:", error.message);
            } else {
                console.error("Google Sign-in error:", error);
            }
        }
    };

    const term = useSelector((state: RootState) => state.term);
    const [user, setUser] = useState<null | User>(null)
    const location = useLocation()

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);


    return (
        <header className="fixed top-5 left-0 right-0 z-50">
            <div className="max-container px-4 sm:px-8 flex items-center justify-between bg-background/75 backdrop-blur-sm border rounded-4xl border-muted-foreground/20 py-3">
                <Link to="/" className="flex items-center gap-2">
                    <img className="w-12" src="/quizzz.png" alt="" />
                    <span className='hidden md:blocktext-primary font-bold text-3xl'>Quizzz</span>
                </Link>
                <div className="flex gap-2 md:gap-4 items-center justify-end">
                    {location.pathname === "/" && (
                        // <Input className="max-sm:w-1/4" value={term} onChange={(e) => dispatch(setSearchTerm(e.target.value))} placeholder="Search for quizzzes..." />
                        <Dialog>
                            <DialogTrigger>
                                <Search size={20} className="text-neutral-400 hover:text-foreground" />
                            </DialogTrigger>
                            <DialogContent>
                                <Input className="max-sm:w-1/4" value={term} onChange={(e) => dispatch(setSearchTerm(e.target.value))} placeholder="Search for quizzzes..." />
                            </DialogContent>
                        </Dialog>
                    )}
                    <Button onClick={() => {
                        auth ?
                            navigate("/create") :
                            navigate("/login")
                    }}>
                        <Plus size={30} strokeWidth={4} />
                        <span className="hidden sm:block">Create Quiz</span>
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
                            <DropdownMenuItem className="cursor-pointer" onClick={() => setTheme("light")}>
                                Light
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer" onClick={() => setTheme("dark")}>
                                Dark
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer" onClick={() => setTheme("system")}>
                                System
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <div className='flex items-center'>
                        {user?.uid ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger className='flex items-center justify-center w-9 h-9'>
                                    <img className="rounded-full brightness-90 hover:brightness-75 duration-150" src={user.photoURL || "/profile.png"} alt="" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className='w-40 lg:w-50'>
                                    <DropdownMenuLabel className="whitespace-nowrap text-ellipsis">
                                        Welcome, {user.displayName || "User"}
                                    </DropdownMenuLabel>
                                    <DropdownMenuLabel className={cn("whitespace-nowrap text-ellipsis font-normal text-neutral-400 flex items-center gap-2 cursor-pointer", (user.emailVerified || "text-yellow-200"))} title={user.emailVerified ? "" : "Email not verified"}>
                                        {user.emailVerified || <OctagonAlert className="hidden lg:block" size={15} />}{user.email}
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleSignOut} className='text-red-500 cursor-pointer'>
                                        Sign Out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Button title="Sign In" className='w-9' variant="outline" onClick={() => navigate("/login")}>
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