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
import { useDispatch } from 'react-redux'
import { apiUrl } from '@/lib/env'
import { setUser } from '@/lib/_slices/userSlice'
import { AppDispatch } from '@/lib/store'
import { getBearerHeader } from '@/app/_services/getBearerHeader.service'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const router = useRouter()
  const [errDialog, setErrDialog] = useState(false)
  const dispatch = useDispatch<AppDispatch>()

  // err section
  const [usernameErr, setUsernameErr] = useState('')
  const [passwordErr, setPasswordErr] = useState('')

  const handleLogin = async () => {
    try {
      const loginResponse = await axios.post(`${apiUrl}/auth/login`, {
        username: username,
        password: password,
      })

      localStorage.setItem('token', loginResponse.data.data.access_token)

      if (loginResponse.status === 200) {
        const getUserResponse = await axios.get(
          `${apiUrl}/users/${username}`,
          getBearerHeader(localStorage.getItem('token')!)
        )

        dispatch(setUser(getUserResponse.data.data))
        localStorage.setItem('username', getUserResponse.data.data.username)

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
              HonestTest Login
            </CardTitle>
            <CardDescription className={'text-center'}>
              Created by TA-12 IF 21
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className={'flex flex-col mb-3'}>
              <Input
                id={'input-username'}
                type={'text'}
                placeholder={'Username'}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <span className={'text-red-500 text-sm'}>{usernameErr}</span>
            </div>

            <div className={'flex flex-col'}>
              <Input
                id={'input-password'}
                type={'password'}
                placeholder={'Password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className={'text-red-500 text-sm'}>{passwordErr}</span>
            </div>
          </CardContent>

          <CardFooter className={'gap-x-3 flex-col items-start'}>
            <div className="flex gap-x-3 w-full">
              <Button
                onClick={() => {
                  setUsernameErr('')
                  setPasswordErr('')

                  if (username === '') {
                    setUsernameErr('Cannot be blank.')
                    return
                  }

                  if (password === '') {
                    setPasswordErr('Cannot be blank.')
                    return
                  }

                  handleLogin().then()
                }}
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
