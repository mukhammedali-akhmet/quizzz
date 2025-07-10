import { Link, useNavigate } from 'react-router-dom'
import { Check, ChevronDown, Languages, LogIn, LogOut, Moon, Search, Sun } from 'lucide-react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { useTheme } from './ThemeProvider'
import { getAuth, onAuthStateChanged, signOut, type User } from "firebase/auth";
import { useEffect, useState } from 'react'
import { Dialog, DialogContent } from './ui/dialog'
import { DialogTrigger } from '@radix-ui/react-dialog'
import { SidebarTrigger } from './ui/sidebar'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

export const iconTriggerClass = "size-9 hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"

const Header = () => {
    const navigate = useNavigate()
    const [user, setUser] = useState<null | User>(null)
    const { t, i18n } = useTranslation()
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
                setUser(auth.currentUser)

            } else {
                setUser(null)
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <header className="fixed top-0 w-full z-50 bg-sidebar border-b h-[var(--sidebar-width-icon)] flex items-center">
            <div className="w-[96%] sm:w-[95%] md:w-[80%] lg:w-[84%] xl:w-[87%] 2xl:w-[88%] ml-3 flex justify-between items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-4">
                    <SidebarTrigger title="Toggle Sidebar" />
                </div>
                <Dialog>
                    <DialogTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2 has-[>svg]:px-3 text-neutral-400" title="Search">
                        <Search size={16} />
                        <span>{t("header.search")}</span>
                    </DialogTrigger>
                    <DialogContent>
                        <Input />
                    </DialogContent>
                </Dialog>
                <div className="flex items-center sm:gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger className={cn(iconTriggerClass, 'flex items-center text-neutral-400')} title="Change theme">
                            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            <span className="sr-only">Toggle theme</span>
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
                        <DropdownMenuTrigger className={cn(iconTriggerClass, 'flex items-center text-neutral-400')} title="Change language">
                            <Languages size={16} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {languages.map(lang => (
                                <DropdownMenuItem key={lang.code} className="cursor-pointer justify-center" onClick={() => {
                                    setLanguage(lang.code);
                                    i18n.changeLanguage(lang.code)
                                }}>
                                    {language === lang.code && <Check />}
                                    {lang.label}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger className="text-neutral-400 flex gap-1 sm:pr-1 items-center border-2 rounded-full duration-75 hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50">
                                {user.photoURL ?
                                    <img className="h-8 w-8 rounded-full" src={user?.photoURL} alt="" />
                                    :
                                    <img className="h-8 w-8 rounded-full" src="/profile.png" alt="" />
                                }
                                <ChevronDown className="max-sm:hidden" size={16} />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="p-2 flex flex-col gap-1 text-sm">
                                <div >
                                    {user?.displayName ? user?.displayName : "Guest"}
                                </div>
                                <div className="text-neutral-400">
                                    {user.email}
                                </div>
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