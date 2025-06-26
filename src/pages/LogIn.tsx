import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { CgGoogle } from "react-icons/cg"
import { useEffect, useState } from "react"
import { collection, doc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore"
import { db, googleProvider } from "@/lib/firebase"
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInAnonymously, signInWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { v4 as uuidv4 } from 'uuid';
import { toast } from "sonner"

const signUpEmailPasswordSchema = z.object({
    email: z.string().email({ message: "Wrong email format" }),
    password: z.string().min(8, { message: "Minimum 8 symbols" }).regex(/^(?=.*[a-zA-Z])(?=.*\d).+$/, {
        message: "Password should contain letters and numbers",
    })
})

const signUpNameUsernameSchema = z.object({
    name: z.string().min(1, { message: "Fill in your Name" }).max(30, { message: "Too long, 30 symbols maximum" }),
    username: z.string().min(3, { message: "Minimum 3 symbols" }).max(20, { message: "Maximum 20 symbols" }).regex(/^[a-zA-Z0-9]+$/u, { message: "Only latin letters and numbers" }),
})

const signInEmailPasswordSchema = z.object({
    email: z.string().email({ message: "Wrong email format" }),
    password: z.string()
})

const resetPasswordSchema = z.object({
    email: z.string().email({ message: "Wrong email format" })
})

type signUpEmailPasswordData = z.infer<typeof signUpEmailPasswordSchema>
type signUpNameUsernameData = z.infer<typeof signUpNameUsernameSchema>
type signInEmailPasswordData = z.infer<typeof signInEmailPasswordSchema>
type resetPasswordData = z.infer<typeof resetPasswordSchema>

export default function LogIn() {
    const signUpEmailPasswordForm = useForm<signUpEmailPasswordData>({
        resolver: zodResolver(signUpEmailPasswordSchema),
    })
    const signUpNameUsernameForm = useForm<signUpNameUsernameData>({
        resolver: zodResolver(signUpNameUsernameSchema),
    })
    const signInEmailPasswordForm = useForm<signInEmailPasswordData>({
        resolver: zodResolver(signInEmailPasswordSchema),
    })
    const resetPasswordForm = useForm<resetPasswordData>({
        resolver: zodResolver(resetPasswordSchema),
    })

    const [mode, setMode] = useState("sign-up");
    const [firstCheckSuccess, setFirstCheckSuccess] = useState(false);
    const [resetPassword, setResetPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false);
    const [recommendedUsernames, setRecommendedUsernames] = useState<string[]>([])
    const [wrongPassword, setWrongPassword] = useState(false)

    const auth = getAuth()
    const navigate = useNavigate()

    const firstSignUpCheck = async (data: signUpEmailPasswordData) => {
        setIsLoading(true);
        try {
            const q = query(collection(db, "users"), where("email", "==", data.email));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                setMode("sign-in");
            } else {
                setFirstCheckSuccess(true);
                const userCredentials = await createUserWithEmailAndPassword(auth, data.email, data.password)

                await setDoc(doc(db, "users", data.email), {
                    email: userCredentials.user.email
                })
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const secondSignUpCheck = async (data: signUpNameUsernameData) => {
        setIsLoading(true)
        try {
            if (auth.currentUser) {
                const q = query(collection(db, "users"), where("username", "==", data.username))
                const querySnapshot = await getDocs(q)
                if (querySnapshot.empty) {
                    await updateProfile(auth.currentUser, {
                        displayName: data.name
                    })
                    await updateDoc(doc(db, "users", auth.currentUser.email!), {
                        name: data.name,
                        username: data.username
                    })
                    navigate("/")
                } else {
                    setRecommendedUsernames([...recommendedUsernames, (data.username + uuidv4()).split("-")[0]])
                }
            } else {
                throw new Error("No authenticated user found.");
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const signInWithGoogle = async () => {
        try {
            const userCredentials = await signInWithPopup(auth, googleProvider);
            const q = query(collection(db, "users"), where("email", "==", userCredentials.user.email));
            const querySnapshot = await getDocs(q);
            if (querySnapshot.empty) {
                await setDoc(doc(db, "users", userCredentials.user.email!.toString()), {
                    name: userCredentials.user.displayName,
                    profilePicture: userCredentials.user.photoURL,
                    username: userCredentials.user.email!.split("@")[0] + uuidv4().split("-")[0],
                    email: userCredentials.user.email
                })
            }
            navigate("/")
        } catch (error) {
            if (error instanceof Error) {
                console.error("Google Sign-in error:", error.message);
            } else {
                console.error("Google Sign-in error:", error);
            }
        }
    };

    const handleGuestLogIn = async () => {
        signInAnonymously(auth)
            .catch((error) => {
                console.error("Anonymous sign-in error:", error);
            });
        navigate("/")
    }

    const handleSignIn = async (data: signInEmailPasswordData) => {
        setIsLoading(true)
        setWrongPassword(false)
        try {
            await signInWithEmailAndPassword(auth, data.email, data.password)
            navigate("/")
        } catch (error) {
            setWrongPassword(true)
        } finally {
            setIsLoading(false)
        }
    }

    const handleResetPassword = async (data: resetPasswordData) => {
        setIsLoading(true)
        try {
            await sendPasswordResetEmail(auth, data.email)
                .catch((error) => {
                    console.error("Error sending reset email:", error.message);
                });
            toast("A link was sent to your email")
        } catch (error) {

        } finally {
            setResetPassword(false)
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (firstCheckSuccess) {
            signUpNameUsernameForm.reset();
        }
    }, [firstCheckSuccess]);

    return (
        <section className="py-10">
            {mode === "sign-up" ? (
                <div className="flex flex-col gap-5 items-center w-1/3 mx-auto">
                    {!firstCheckSuccess ? (
                        <>
                            <div className="flex flex-col text-center gap-1">
                                <h2 className="text-3xl font-semibold">Create a new account</h2>
                                <p className="text-neutral-400">Sign up to create your own quizzes!</p>
                            </div>
                            <Separator />
                            <form onSubmit={signUpEmailPasswordForm.handleSubmit(firstSignUpCheck)} className="flex flex-col gap-5 w-2/3">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Email"
                                        {...signUpEmailPasswordForm.register("email")}
                                        className={cn(signUpEmailPasswordForm.formState.errors.email && "border-red-500")}
                                    />
                                    {signUpEmailPasswordForm.formState.errors.email && (
                                        <p className="text-sm text-red-500">{signUpEmailPasswordForm.formState.errors.email.message}</p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Password"
                                        {...signUpEmailPasswordForm.register("password")}
                                        className={cn("caret-white", (signUpEmailPasswordForm.formState.errors.password && "border-red-500"))}
                                    />
                                    {signUpEmailPasswordForm.formState.errors.password && (
                                        <p className="text-sm text-red-500">{signUpEmailPasswordForm.formState.errors.password.message}</p>
                                    )}
                                </div>

                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? "Loading..." : "Next"}
                                </Button>
                            </form>
                            <div className="flex items-center text-neutral-400">
                                <p>Already have an account?</p>
                                <Button onClick={() => setMode("sign-in")} variant="link">Sign in</Button>
                            </div>
                            <Separator />
                            <Button onClick={() => signInWithGoogle()} variant="secondary" className="w-3/4 ">
                                <CgGoogle />
                                <span>Sign in with Google</span>
                            </Button>
                            <Button onClick={() => handleGuestLogIn()} variant="link">
                                Log In as Guest
                            </Button>
                        </>
                    ) : (
                        <>
                            <div className="flex flex-col text-center gap-1">
                                <h2 className="text-3xl font-semibold">Choose name and username</h2>
                                <p className="text-neutral-400">They will be displayed in your profile</p>
                            </div>
                            <Separator />
                            <form onSubmit={signUpNameUsernameForm.handleSubmit(secondSignUpCheck)} className="flex flex-col gap-5 w-2/3">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="Name"
                                        {...signUpNameUsernameForm.register("name")}
                                        className={cn(signUpNameUsernameForm.formState.errors.name && "border-red-500")}
                                    />
                                    {signUpNameUsernameForm.formState.errors.name && (
                                        <p className="text-sm text-red-500">{signUpNameUsernameForm.formState.errors.name.message}</p>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input
                                        id="username"
                                        type="text"
                                        placeholder="Username"
                                        {...signUpNameUsernameForm.register("username")}
                                        value={signUpNameUsernameForm.watch("username")}

                                        className={cn(signUpNameUsernameForm.formState.errors.username && "border-red-500")}
                                    />
                                    {signUpNameUsernameForm.formState.errors.username && (
                                        <p className="text-sm text-red-500">{signUpNameUsernameForm.formState.errors.username.message}</p>
                                    )}
                                    {recommendedUsernames.length >= 1 && (
                                        <div>
                                            <p className="text-sm text-red-500">Username already exists</p>
                                            <div className="flex gap-2 text-sm font-medium">
                                                Choose available:
                                                {recommendedUsernames.map((rec) => (
                                                    <div onClick={() => signUpNameUsernameForm.setValue("username", rec)} className="cursor-pointer text-neutral-400 hover:text-white duration-150">{rec}</div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? "Loading..." : "Sign Up"}
                                </Button>
                            </form>
                        </>
                    )}
                </div>
            ) : resetPassword || (
                <div className="flex flex-col gap-5 items-center w-1/3 mx-auto">
                    <div className="flex flex-col text-center gap-1">
                        <h2 className="text-3xl font-semibold">Welcome back!</h2>
                    </div>
                    <Separator />
                    <form onSubmit={signInEmailPasswordForm.handleSubmit(handleSignIn)} className="flex flex-col gap-5 w-2/3">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Email"
                                {...signInEmailPasswordForm.register("email")}
                                className={cn("caret-white", (wrongPassword && "border-red-500"))}
                            />
                            {signInEmailPasswordForm.formState.errors.email && (
                                <p className="text-sm text-red-500">{signInEmailPasswordForm.formState.errors.email.message}</p>
                            )}
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Password"
                                {...signInEmailPasswordForm.register("password")}
                                className={cn("caret-white", (wrongPassword && "border-red-500"))}
                            />
                            {wrongPassword && (
                                <p className="text-sm text-red-500">Wrong email or password</p>
                            )}
                        </div>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Loading..." : "Sign In"}
                        </Button>
                    </form>
                    <div className="flex items-center text-neutral-400">
                        <p>Don't remember your password?</p>
                        <Button onClick={() => setResetPassword(true)} variant="link">Reset</Button>
                    </div>
                    <div className="flex items-center text-neutral-400">
                        <p>Don't have an account?</p>
                        <Button onClick={() => setMode("sign-up")} variant="link">Sign up</Button>
                    </div>
                    <Separator />
                    <Button onClick={() => signInWithGoogle()} variant="secondary" className="w-3/4 ">
                        <CgGoogle />
                        <span>Sign in with Google</span>
                    </Button>
                    <Button onClick={() => handleGuestLogIn()} variant="link">
                        Log In as Guest
                    </Button>
                </div>
            )}
            {resetPassword && (
                <div className="flex flex-col gap-5 items-center w-1/3 mx-auto">
                    <div className="flex flex-col text-center gap-1">
                        <h2 className="text-3xl font-semibold">Reset your password</h2>
                    </div>
                    <Separator />
                    <form onSubmit={resetPasswordForm.handleSubmit(handleResetPassword)} className="flex flex-col gap-5 w-2/3">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Email"
                                {...resetPasswordForm.register("email")}
                                className={cn("caret-white", (wrongPassword && "border-red-500"))}
                            />
                            {resetPasswordForm.formState.errors.email && (
                                <p className="text-sm text-red-500">{resetPasswordForm.formState.errors.email.message}</p>
                            )}
                        </div>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Loading..." : "Send email link"}
                        </Button>
                    </form>
                </div>
            )}
        </section>
    )
}
