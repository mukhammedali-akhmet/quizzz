import { Link, useNavigate } from 'react-router-dom'
import { Check, ChevronDown, Languages, LogIn, LogOut, Moon, OctagonAlert, Search, Sun, User2 } from 'lucide-react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { useTheme } from './theme-provider'
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from 'react'
import { Dialog, DialogContent } from './ui/dialog'
import { DialogTrigger } from '@radix-ui/react-dialog'
import { SidebarTrigger } from './ui/sidebar'
import { useTranslation } from 'react-i18next'

const Header = () => {
    const navigate = useNavigate()
    const auth = getAuth()
    const { t, i18n } = useTranslation()

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
    const [language, setLanguage] = useState("en");
    const languages = [
        {
            label: "English",
            code: "en"
        },
        {
            label: "Russian",
            code: "ru"
        }
    ]

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // setUser(user);
            } else {
                // setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);


    return (
        <header className="fixed top-0 w-full z-50 bg-sidebar border-b h-[var(--sidebar-width-icon)] flex items-center">
            <div className="w-[88%] ml-3 flex justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                    <SidebarTrigger />
                    <Dialog>
                        <DialogTrigger className="text-neutral-400">
                            <Button variant="outline">
                                <Search size={16} />
                                <span>{t("header.search")}</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <Input />
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild className='flex items-center text-neutral-400'>
                            <Button variant="ghost" size="icon">
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
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Button className="text-neutral-400" variant="ghost" size="icon">
                                <Languages size={16} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {languages.map(lang => (
                                <DropdownMenuItem className="cursor-pointer justify-center" onClick={() => {
                                    setLanguage(lang.code);
                                    i18n.changeLanguage(lang.code)
                                }}>
                                    {language === lang.code && <Check />}
                                    {lang.label}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    {auth.currentUser ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger className="text-neutral-400 hover:text-neutral-300 hover:border-neutral-300 flex pr-1 items-center border rounded-full duration-75">
                                {auth.currentUser?.photoURL ?
                                    <img className="h-8 rounded-full" src={auth.currentUser?.photoURL} alt="" /> :
                                    <Button size="icon" variant="ghost">
                                        <User2 size={16} />
                                    </Button>}
                                <ChevronDown size={16} />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="p-2 flex flex-col gap-1 text-sm">
                                <div >
                                    {auth.currentUser?.displayName}
                                </div>
                                {auth.currentUser?.emailVerified ?
                                    <div className="text-neutral-400">
                                        {auth.currentUser.email}
                                    </div> :
                                    <div className="text-amber-200 flex items-center gap-1">
                                        <OctagonAlert size={16} />
                                        <span>{auth.currentUser?.email}</span>
                                    </div>}
                                <Button className="mt-1 border hover:border-red-500 hover:text-red-500" onClick={handleSignOut} variant="ghost" size="sm" title={t("header.signOut")}>
                                    <LogOut />
                                    {t("header.signOut")}
                                </Button>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Link to="/login">
                            <Button variant="default">
                                <LogIn />
                                <span>{t("header.signIn")}</span>
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Header