import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { confirmPasswordReset, getAuth } from "firebase/auth";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const newPasswordSchema = z.object({
    password: z.string().min(8, { message: "Minimum 8 symbols" }).regex(/^(?=.*[a-zA-Z])(?=.*\d).+$/, {
        message: "Password should contain letters and numbers",
    })
})

type newPasswordData = z.infer<typeof newPasswordSchema>

const ResetPassword = () => {
    const oobCode = new URLSearchParams(window.location.search).get("oobCode");
    const auth = getAuth()
    const [isLoading, setIsLoading] = useState(false)

    const newPasswordForm = useForm<newPasswordData>({
        resolver: zodResolver(newPasswordSchema),
    })

    const handleSetNewPassword = async (data: newPasswordData) => {
        setIsLoading(true)
        try {
            await confirmPasswordReset(auth, oobCode!, data.password)
            toast("Your password was updated successfully")
        } catch (error) {

        } finally {
            setIsLoading(false)
        }

    }

    return (
        <div className="flex flex-col gap-5 items-center w-1/3 mx-auto">
            <div className="flex flex-col text-center gap-1">
                <h2 className="text-3xl font-semibold">Reset your password</h2>
            </div>
            <Separator />
            <form onSubmit={newPasswordForm.handleSubmit(handleSetNewPassword)} className="flex flex-col gap-5 w-2/3">
                <div className="flex flex-col gap-2">
                    <Label htmlFor="password">New Password</Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="New Password"
                        {...newPasswordForm.register("password")}
                        className={cn("caret-white", (newPasswordForm.formState.errors.password && "border-red-500"))}
                    />
                    {newPasswordForm.formState.errors.password && (
                        <p className="text-sm text-red-500">{newPasswordForm.formState.errors.password.message}</p>
                    )}
                </div>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Loading..." : "Set new password"}
                </Button>
            </form>
        </div>
    )
}

export default ResetPassword