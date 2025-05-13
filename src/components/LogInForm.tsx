import { getAuth, onAuthStateChanged } from "firebase/auth";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import { googleProvider } from "../lib/firebase";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { AppDispatch, RootState } from "@/app/store";
import { useEffect, useState } from "react";
import { CgGoogle } from "react-icons/cg";
import { Separator } from "./ui/separator";
import { toast } from "sonner";
import { signInUser } from "@/features/user/userSlice";

const LogInForm = () => {
    const dispatch = useDispatch<AppDispatch>();
    const auth = getAuth();

    const modal = useSelector((state: RootState) => state.modal)
    const user = useSelector((state: RootState) => state.user)

    const [mode, setMode] = useState("register");

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignUp = async (email: string, password: string) => {
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password);

        await updateProfile(userCredentials.user, {
            displayName: name,
        })

        dispatch(signInUser({
            name: userCredentials.user.displayName,
            username: userCredentials.user.email?.split("@")[0],
            email: userCredentials.user.email,
            uid: userCredentials.user.uid,
        }))
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>, mode: string) => {
        event.preventDefault();

        switch (mode) {
            case "register":
                handleSignUp(email, password);
                break;
            case "log-in":
                handleLogIn(email, password);
                break;
        }
    }

    const handleLogIn = async (email: string, password: string) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            dispatch(signInUser({
                name: userCredential.user.displayName,
                username: userCredential.user.email?.split("@")[0],
                email: userCredential.user.email,
                uid: userCredential.user.uid,
            }))
        } catch (error) {
            toast.error("Invalid email or password", {
                action: {
                    label: "Create an account",
                    onClick: () => {
                        setMode("register")
                    }
                }
            });
        }
    };

    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            if (error instanceof Error) {
                console.error("Google Sign-in error:", error.message);
            } else {
                console.error("Google Sign-in error:", error);
            }
        }
    };

    const handleGuestLogIn = async () => {
        const userCredential = await signInWithEmailAndPassword(auth, "guest@gmail.com", "guest123");
        dispatch(signInUser({
            name: "Guest",
            username: userCredential.user.email?.split("@")[0],
            email: userCredential.user.email,
            uid: userCredential.user.uid,
        }))
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) return
            console.log("User logged in:", currentUser);

            dispatch(signInUser({
                name: currentUser.displayName,
                username: currentUser.email?.split("@")[0],
                email: currentUser.email,
                photoURL: currentUser.photoURL,
                uid: currentUser.uid,
            }))
        })

        return unsubscribe
    }, [])

    return (
        <Card className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] z-[99] duration-150 ${!user.username && modal ? "scale-100 opacity-100 block" : "scale-75 hidden -translate-y-1/3 opacity-0"} `}>
            <CardHeader>
                <CardTitle className="text-2xl text-center">
                    {mode === "register" ? "Create an account" : "Welcome back!"}
                    <CardDescription className="text-sm text-center text-neutral-400">
                        {mode === "register" ? "Sign up to create your own quizzes!" : "Log in to access your quizzes!"}
                    </CardDescription>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 mt-5">
                <form onSubmit={(e) => handleSubmit(e, mode)} className="flex flex-col gap-4">
                    {mode === "register" ? (
                        <>
                            <Input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            <Input type="submit" className="cursor-pointer hover:opacity-90" />
                        </>
                    ) : (
                        <>
                            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            <Input type="submit" className="cursor-pointer hover:opacity-90" />
                        </>
                    )
                    }
                </form>
                {mode === "register" ? (
                    <p className="text-center mt-2 text-neutral-400">Already have an account? <Button onClick={() => setMode("log-in")} variant="link">Log in</Button></p>
                ) : (
                    <p className="text-center mt-2 text-neutral-400">Don't have an account? <Button onClick={() => setMode("register")} variant="link">Create one</Button></p>
                )}
                <Separator className="my-2" />
                <Button onClick={signInWithGoogle} className="w-full mt-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-900">
                    <CgGoogle />
                    <span>Sign in with Google</span>
                </Button>
            </CardContent>
            <CardFooter className="flex flex-col gap-2 justify-center mt-2">
                {/* <Separator className="my-2" /> */}
                <Button onClick={() => handleGuestLogIn()} variant="link">Log in as Guest</Button>
            </CardFooter>
        </Card>
    )
}

export default LogInForm