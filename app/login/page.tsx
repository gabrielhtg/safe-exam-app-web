import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import Link from "next/link";

export default function LoginPage() {
  return (
      <>
        <div className={'bg-cover bg-center h-screen w-full bg-[url(/assets/images/login-bg.jpg)]'}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
          <div className={'relative w-full h-screen flex justify-center items-center'}>
            <Card className={'w-[380px] px-5'}>
              <CardHeader>
                <CardTitle className={'text-2xl text-center mb-3'}>Safe Exam Login</CardTitle>
                <CardDescription className={'text-center'}>
                  Created by TA-12 IF 21
                </CardDescription>
              </CardHeader>

              <CardContent>
                <Input id={'input-username'} type={'text'} className={'mb-3'} placeholder={'Username'}></Input>
                <Input id={'input-password'} type={'password'} placeholder={'Password'}></Input>
              </CardContent>

              <CardFooter className={'gap-x-3 flex-col items-start'}>
                <div className="flex gap-x-3 w-full">
                  <Button id="button-login" className="w-full">Login</Button>
                  <Button asChild={true} id="button-register" className="w-full" variant="secondary">
                    <Link href={'/register'}>Register</Link>
                  </Button>
                </div>

                <Link href="/password/reset" className="text-sm text-blue-500 hover:underline text-left mt-3">Lupa kata sandi?</Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </>
  )
}
