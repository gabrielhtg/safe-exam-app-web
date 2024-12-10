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
import { CircleCheck, CircleX, ImagePlus, LogIn } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Skeleton } from '@/components/ui/skeleton'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rePassword, setRePassword] = useState('')
  const [profilePict, setProfilePict] = useState('')
  const [fotoProfil, setFotoProfil] = useState<File | undefined>()
  const router = useRouter()

  const [dialogMsg, setDialogMsg] = useState('')
  const [errDialog, setErrDialog] = useState(false)
  const [dialogType, setDialogType] = useState(1)

  const handleRegister = async () => {
    const formData = new FormData()
    formData.append('name', name)
    formData.append('username', username)
    formData.append('email', email)
    formData.append('password', password)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    formData.append('profile_pict', fotoProfil)
    try {
      if (password == rePassword) {
        const response = await axios.post(
          'http://localhost:3001/users',
          formData
        )

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
        <Card className={'w-full max-w-lg px-5'}>
          <CardHeader>
            <CardTitle className={'text-2xl text-center mb-3'}>
              Safe Exam Register
            </CardTitle>
            <CardDescription className={'text-center'}>
              Created by TA-12 IF 21
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className={'flex justify-center mb-3'}>
              {profilePict == '' ? (
                <Skeleton
                  className={
                    'w-48 h-48 rounded-full flex items-center justify-center'
                  }
                >
                  <ImagePlus />
                </Skeleton>
              ) : (
                <Image
                  src={profilePict}
                  alt={'foto-profil'}
                  className={'object-cover rounded-full w-48 h-48'}
                  width={500}
                  height={500}
                />
              )}
            </div>

            <Input
              className={'mb-3'}
              id="picture"
              type="file"
              onChange={(e) => {
                setProfilePict(URL.createObjectURL(e.target.files![0]))
                setFotoProfil(e.target.files![0])
              }}
            />

            <Input
              id={'input-name'}
              type={'text'}
              className={'mb-3'}
              onChange={(e) => {
                setName(e.target.value)
              }}
              placeholder={'Name'}
            />

            <Input
              id={'input-username'}
              type={'text'}
              onChange={(e) => {
                setUsername(e.target.value)
              }}
              className={'mb-3'}
              placeholder={'Username'}
            />

            <Input
              id={'input-email'}
              type={'email'}
              onChange={(e) => {
                setEmail(e.target.value)
              }}
              className={'mb-3'}
              placeholder={'Email'}
            />

            <Input
              id={'input-password'}
              type={'password'}
              className={'mb-3'}
              placeholder={'Password'}
              onChange={(e) => {
                setPassword(e.target.value)
              }}
            />

            <Input
              id={'input-reenter-password'}
              type={'password'}
              onChange={(e) => {
                setRePassword(e.target.value)
              }}
              placeholder={'Confirm Password'}
            />
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
