'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/lib/store'
import axios from 'axios'
import { getBearerHeader } from '@/app/_services/getBearerHeader.service'
import { setUser } from '@/lib/_slices/userSlice'
import Link from 'next/link'
import Image from 'next/image'
import { Spinner } from '@/components/custom-component/Spinner'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { CircleX } from 'lucide-react'

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const router = useRouter()
  const [errDialog, setErrDialog] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const [loadingLogin, setLoadingLogin] = useState(false)

  // err section
  const [usernameErr, setUsernameErr] = useState('')
  const [passwordErr, setPasswordErr] = useState('')

  const handleLogin = async () => {
    try {
      const loginResponse = await axios.post(
        `${process.env.API_URL}/auth/login`,
        {
          username: username,
          password: password,
        }
      )

      localStorage.setItem('token', loginResponse.data.data.access_token)

      if (loginResponse.status === 200) {
        const getUserResponse = await axios.get(
          `${process.env.API_URL}/users/${username}`,
          getBearerHeader(localStorage.getItem('token')!)
        )

        dispatch(setUser(getUserResponse.data.data))
        localStorage.setItem('username', getUserResponse.data.data.username)
        setLoadingLogin(false)

        router.push('/main')
      }
    } catch (err: any) {
      setErrDialog(true)
      setLoadingLogin(false)
      setErrMsg(err.response.data.message)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      handleLogin().then()
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="overflow-hidden" onKeyDown={handleKeyDown}>
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome Back</h1>
                <p className="text-balance text-muted-foreground">
                  Login to your HonesTest account
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e: any) => {
                    setUsername(e.target.value)
                  }}
                  required
                />
                <span className={'text-red-500 text-xs'}>{usernameErr}</span>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/password/reset"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e: any) => {
                    setPassword(e.target.value)
                  }}
                  required
                />
                <span className={'text-red-500 text-xs'}>{passwordErr}</span>
              </div>
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

                  setLoadingLogin(true)
                  handleLogin().then()
                }}
                className="w-full"
              >
                Login{' '}
                {loadingLogin ? (
                  <Spinner className={'text-primary-foreground'} />
                ) : (
                  ''
                )}
              </Button>
              <div className="text-center text-sm">
                Don&apos;t have an account?{' '}
                <Link
                  href={'/register'}
                  className={'underline-offset-4 hover:underline'}
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
          <div className="relative hidden bg-muted md:block">
            <Image
              src={'/assets/images/5366119.png'}
              alt="Image"
              width={100}
              height={100}
              className="absolute inset-0 h-full w-full object-cover dark:grayscale p-8"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        Created By TA-12 Institut Teknologi Del
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
    </div>
  )
}
