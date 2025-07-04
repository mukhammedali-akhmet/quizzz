import { Button } from "@/components/ui/button"
import { FaGithub } from "react-icons/fa";
import { Separator } from "@/components/ui/separator"
import { CgGoogle } from "react-icons/cg"
import { googleProvider } from "@/lib/firebase"
import { getAuth, GithubAuthProvider, signInAnonymously, signInWithPopup, } from "firebase/auth"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useState } from "react";


export default function LogIn() {
    const auth = getAuth()
    const navigate = useNavigate()
    const githubProvider = new GithubAuthProvider()
    const [loading, setLoading] = useState<"google" | "github" | "">("")

    const handleSignInWithGoogle = async () => {
        setLoading("google");
        try {
            await signInWithPopup(auth, googleProvider);

            navigate("/")
        } catch (error) {
            if (error instanceof Error) {
                console.error("Google Sign-in error:", error.message);
            } else {
                console.error("Google Sign-in error:", error);
            }
        } finally {
            setLoading("");
        }
    };

    const handleSignInWithGithub = async () => {
        setLoading("github");

        try {
            const result = await signInWithPopup(auth, githubProvider);
            const user = result.user;
            console.log("User signed in:", user);
            navigate("/");
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error(String(error));
            }
        } finally {
            setLoading("");

        }
    }

    const handleGuestLogIn = async () => {
        signInAnonymously(auth)
            .catch((error) => {
                console.error("Anonymous sign-in error:", error);
            });

        navigate("/")
    }

    return (
        <section className="pt-[10vw]">

            <div className="flex flex-col gap-5 items-center lg:w-1/3 mx-auto">

                <div className="flex flex-col text-center gap-1">
                    <h2 className="text-3xl font-semibold">Sign In to Quizzz</h2>
                    <p className="text-neutral-400">to create your own quizzes!</p>
                </div>
                <Separator className="data-[orientation=horizontal]:w-3/4" />
                <Button disabled={loading !== ""} onClick={() => handleSignInWithGoogle()} variant="outline" className="w-3/4">
                    {loading === "google" ? <img src="/loading.gif" /> : <CgGoogle />}

                    <span>Sign in with Google</span>
                </Button>
                <Button disabled={loading !== ""} onClick={() => handleSignInWithGithub()} variant="outline" className="w-3/4">
                    {loading === "github" ? <img src="/loading.gif" /> : <FaGithub />}

                    <span>Sign in with Github</span>
                </Button>
                <Button disabled={loading !== ""} className="text-foreground" onClick={() => handleGuestLogIn()} variant="link">
                    Log In as Guest
                </Button>

            </div>

        </section>
    )
}
