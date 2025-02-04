'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { LockKeyhole } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'
import axios from 'axios'
import { apiUrl } from '@/lib/env'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState<string>('')
  const [emailErr, setEmailErr] = useState<string>('')

  const handleResetPassword = async () => {
    try {
      const response = await axios.post(`${apiUrl}/auth/reset-password`, {
        email: email,
      })

      if (response.status == 200) {
        toast.success(response.data.message)
      }
    } catch (e: any) {
      toast.error(e.response.data.message)
    }
  }

  return (
    <div className={'flex items-center justify-center h-screen'}>
      <Card className={'w-[400px]'}>
        <CardHeader>
          <div className={'flex items-center justify-center mb-3'}>
            <div className={'border-2 border-black p-8 rounded-full'}>
              <LockKeyhole strokeWidth={1.25} className={'w-[30px] h-[30px]'} />
            </div>
          </div>
          <CardTitle className={'text-center'}>Trouble Logging In?</CardTitle>

          <CardDescription className={'text-center'}>
            Enter your email and we&aposll send you a link to get back into your
            account.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Input
            id={'input-email'}
            placeholder={'Email'}
            value={email}
            onChange={(e: any) => {
              setEmail(e.target.value)
            }}
          />
          <span className={'text-red-500 text-sm'}>{emailErr}</span>

          <Button
            onClick={() => {
              if (email === '') {
                setEmailErr('Cannot be blank!')
                return
              }

              if (!email.includes('@')) {
                setEmailErr('Invalid email')
                return
              }

              handleResetPassword().then()
            }}
            className={'w-full mt-5'}
          >
            Reset Password
          </Button>
          <Button
            className={'w-full mt-3'}
            variant={'secondary'}
            asChild={true}
          >
            <Link href={'/'}>Back to Login</Link>
          </Button>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  )
}
