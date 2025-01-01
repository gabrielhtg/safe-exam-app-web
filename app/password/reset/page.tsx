import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {LockKeyhole} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import Link from "next/link";

export default function ResetPasswordPage() {
    return(
        <div className={'flex items-center justify-center h-screen'}>
            <Card className={'w-[400px]'}>
                <CardHeader>
                    <div className={'flex items-center justify-center mb-3'}>
                        <div className={'border-2 border-black p-8 rounded-full'}>
                            <LockKeyhole strokeWidth={1.25} className={'w-[30px] h-[30px]'}/>
                        </div>
                    </div>
                    <CardTitle className={'text-center'}>
                        Trouble Logging In?
                    </CardTitle>

                    <CardDescription className={'text-center'}>
                        Enter your email and we&aposll send you a link to get back into your account.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <Input id={'input-email'} placeholder={'Email'}></Input>

                    <Button className={'w-full mt-5'}>Send Login Link</Button>
                    <Button className={'w-full mt-3'} variant={"secondary"} asChild={true}>
                        <Link href={'/login'}>
                            Back to Login
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}