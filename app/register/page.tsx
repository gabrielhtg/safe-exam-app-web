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
import { apiUrl, compressOptions } from '@/lib/env'
import { useState } from 'react'
import { ImagePlus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Skeleton } from '@/components/ui/skeleton'
import { toast, Toaster } from 'sonner'
import imageCompression from 'browser-image-compression'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rePassword, setRePassword] = useState('')
  const [profilePict, setProfilePict] = useState('')
  const [fotoProfil, setFotoProfil] = useState<File | undefined>()
  const router = useRouter()

  // err section
  const [nameErr, setNameErr] = useState('')
  const [usernameErr, setUsernameErr] = useState('')
  const [emailErr, setEmailErr] = useState('')
  const [passwordErr, setPasswordErr] = useState('')
  const [rePasswordErr, setRePasswordErr] = useState('')

  const handleRegister = async () => {
    const formData = new FormData()
    formData.append('name', name)
    formData.append('username', username)
    formData.append('email', email)
    formData.append('password', password)
    if (fotoProfil) {
      const compressedImage = await imageCompression(
        fotoProfil!,
        compressOptions
      )
      formData.append('profile_pict', compressedImage)
    } else {
      formData.append('profile_pict', fotoProfil!)
    }

    try {
      if (password == rePassword) {
        const response = await axios.post(`${apiUrl}/users/`, formData)

        if (response.status === 200) {
          toast.success(response.data.message, {
            action: {
              label: 'Login',
              onClick: () => router.push('/'),
            },
          })
        }
      } else {
        toast.error('Passwords are not the same!')
      }
    } catch (err: any) {
      toast.error(err.response.data.message)
    }
  }

  return (
    <>
      <div
        className={'relative w-full h-screen flex justify-center items-center'}
      >
        <Card className={'w-full max-w-lg px-5'}>
          <CardHeader>
            <CardTitle className={'text-2xl text-center mb-3'}>
              HonesTest Register
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
              accept="image/jpeg, image/png"
              onChange={(e) => {
                setProfilePict(URL.createObjectURL(e.target.files![0]))
                setFotoProfil(e.target.files![0])
              }}
            />

            <div className={'flex flex-col mb-3'}>
              <Input
                id={'input-name'}
                type={'text'}
                className={'mb-3'}
                onChange={(e) => {
                  setName(e.target.value)
                }}
                placeholder={'Name'}
              />
              <span className={'text-red-500 text-sm'}>{nameErr}</span>
            </div>

            <div className={'flex flex-col mb-3'}>
              <Input
                id={'input-username'}
                type={'text'}
                onChange={(e) => {
                  setUsername(e.target.value)
                }}
                placeholder={'Username'}
              />
              <span className={'text-red-500 text-sm'}>{usernameErr}</span>
            </div>

            <div className={'flex flex-col mb-3'}>
              <Input
                id={'input-email'}
                type={'email'}
                onChange={(e) => {
                  setEmail(e.target.value)
                }}
                placeholder={'Email'}
              />
              <span className={'text-red-500 text-sm'}>{emailErr}</span>
            </div>

            <div className={'flex flex-col mb-3'}>
              <Input
                id={'input-password'}
                type={'password'}
                placeholder={'Password'}
                onChange={(e) => {
                  setPassword(e.target.value)
                }}
              />
              <span className={'text-red-500 text-sm'}>{passwordErr}</span>
            </div>

            <div className={'flex flex-col'}>
              <Input
                id={'input-reenter-password'}
                type={'password'}
                onChange={(e) => {
                  setRePassword(e.target.value)
                }}
                placeholder={'Confirm Password'}
              />
              <span className={'text-red-500 text-sm'}>{rePasswordErr}</span>
            </div>
          </CardContent>

          <CardFooter className={'gap-x-3 flex-col items-start'}>
            <div className="flex gap-x-3 w-full">
              <Button
                onClick={() => {
                  if (username === '') {
                    setUsernameErr('Cannot be blank')
                    return
                  }

                  if (name === '') {
                    setNameErr('Cannot be blank')
                    return
                  }

                  if (email === '') {
                    setEmailErr('Cannot be blank')
                    return
                  }

                  if (!email.includes('@')) {
                    setEmailErr('Not a valid email')
                    return
                  }

                  if (password === '') {
                    setPasswordErr('Cannot be blank')
                    return
                  }

                  if (rePassword === '') {
                    setRePasswordErr('Cannot be blank')
                    return
                  }

                  handleRegister().then()
                }}
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
                <Link href={'/'}>Login</Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      <Toaster />
    </>
  )
}
