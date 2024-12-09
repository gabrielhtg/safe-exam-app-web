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
import axios from 'axios'
import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { CircleCheck, CircleX, LogIn } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [nama, setNama] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rePassword, setRePassword] = useState('')
  const router = useRouter()

  const [dialogMsg, setDialogMsg] = useState('')
  const [errDialog, setErrDialog] = useState(false)
  const [dialogType, setDialogType] = useState(1)

  const handleRegister = async () => {
    try {
      if (password == rePassword) {
        const response = await axios.post('http://localhost:3001/users', {
          username: username,
          password: password,
          email: email,
          name: nama,
        })

        if (response.status === 200) {
          setDialogType(1)
          setDialogMsg(response.data.message)
          setErrDialog(true)
        }
      } else {
        setDialogMsg('Passwords are not the same!')
        setErrDialog(true)
        setDialogType(0)
      }
    } catch (err: any) {
      setDialogMsg(err.response.data.message)
      setErrDialog(true)
      setDialogType(0)
    }
  }

  const getAlertTitle = () => {
    if (dialogType == 1) {
      return (
        <>
          <CircleCheck className={'mb-3 text-green-500'} size={38} />
          Register Success!
        </>
      )
    }

    if (dialogType == 0) {
      return (
        <>
          <CircleX className={'mb-3 text-red-600'} size={38} />
          Register Failed!
        </>
      )
    }

    return ''
  }

  return (
    <>
      <div
        className={'relative w-full h-screen flex justify-center items-center'}
      >
        <Card className={'w-[380px] px-5'}>
          <CardHeader>
            <CardTitle className={'text-2xl text-center mb-3'}>
              Safe Exam Register
            </CardTitle>
            <CardDescription className={'text-center'}>
              Created by TA-12 IF 21
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Input
              id={'input-name'}
              type={'text'}
              className={'mb-3'}
              onChange={(e) => {
                setNama(e.target.value)
              }}
              placeholder={'Name'}
            ></Input>
            <Input
              id={'input-username'}
              type={'text'}
              onChange={(e) => {
                setUsername(e.target.value)
              }}
              className={'mb-3'}
              placeholder={'Username'}
            ></Input>
            <Input
              id={'input-email'}
              type={'email'}
              onChange={(e) => {
                setEmail(e.target.value)
              }}
              className={'mb-3'}
              placeholder={'Email'}
            ></Input>
            <Input
              id={'input-password'}
              type={'password'}
              className={'mb-3'}
              placeholder={'Password'}
              onChange={(e) => {
                setPassword(e.target.value)
              }}
            ></Input>
            <Input
              id={'input-reenter-password'}
              type={'password'}
              onChange={(e) => {
                setRePassword(e.target.value)
              }}
              className={'mb-3'}
              placeholder={'Confirm Password'}
            ></Input>

            {/*<div className="flex justify-center w-full mt-3">*/}
            {/*  <Button asChild={true} id="button-upload-photo" variant="outline">*/}
            {/*    <Link href="/register/upload-photo">Upload Photo</Link>*/}
            {/*  </Button>*/}
            {/*</div>*/}
          </CardContent>

          <CardFooter className={'gap-x-3 flex-col items-start'}>
            <div className="flex gap-x-3 w-full">
              <Button
                onClick={handleRegister}
                id="button-register"
                className="w-full"
              >
                Register
              </Button>
              <Button
                asChild={true}
                id="button-login"
                className="w-full"
                variant="secondary"
              >
                <Link href={'/login'}>Login</Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      <AlertDialog open={errDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle
              className={'text-center flex flex-col items-center'}
            >
              {getAlertTitle()}
            </AlertDialogTitle>
            <AlertDialogDescription className={'text-center'}>
              {dialogMsg}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className={'!justify-center'}>
            <Button
              onClick={() => {
                setErrDialog(false)
                router.push('/')
              }}
            >
              <LogIn />
              Login Now
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
