'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React, { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { CircleX } from 'lucide-react'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const router = useRouter()
  const [errDialog, setErrDialog] = useState(false)

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3001/auth/login', {
        username: username,
        password: password,
      })

      if (response.status === 200) {
        localStorage.setItem('token', response.data.data.access_token)
        router.push('/main')
      }
    } catch (err: any) {
      setErrDialog(true)
      setErrMsg(err.response.data.message)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      handleLogin().then()
    }
  }

  return (
    <>
      <div
        className={'relative w-full h-screen flex justify-center items-center'}
      >
        <Card className={'w-[380px] px-5'} onKeyDown={handleKeyDown}>
          <CardHeader>
            <CardTitle className={'text-2xl text-center mb-3'}>
              Safe Exam Login
            </CardTitle>
            <CardDescription className={'text-center'}>
              Created by TA-12 IF 21
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Input
              id={'input-username'}
              type={'text'}
              className={'mb-3'}
              placeholder={'Username'}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            ></Input>
            <Input
              id={'input-password'}
              type={'password'}
              placeholder={'Password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Input>
          </CardContent>

          <CardFooter className={'gap-x-3 flex-col items-start'}>
            <div className="flex gap-x-3 w-full">
              <Button
                onClick={handleLogin}
                id="button-login"
                className="w-full"
              >
                Login
              </Button>
              <Button
                asChild={true}
                id="button-register"
                className="w-full"
                variant="secondary"
              >
                <Link href={'/register'}>Register</Link>
              </Button>
            </div>

            <Link
              href="/password/reset"
              className="text-sm text-blue-500 hover:underline text-left mt-3"
            >
              Lupa kata sandi?
            </Link>
          </CardFooter>
        </Card>
      </div>

      <AlertDialog open={errDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle
              className={'text-center flex flex-col items-center'}
            >
              <CircleX className={'mb-3 text-red-600'} size={38} />
              Login Failed!
            </AlertDialogTitle>
            <AlertDialogDescription className={'text-center'}>
              {errMsg}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className={'!justify-center'}>
            <Button
              onClick={() => {
                setErrDialog(false)
              }}
            >
              OK
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
