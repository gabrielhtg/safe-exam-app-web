'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { useSelector } from 'react-redux'
import { selectUser } from '@/lib/_slices/userSlice'
import { getUserInitials } from '@/app/_services/getUserInitials.service'
import { apiUrl } from '@/lib/env'
import { formatProfileDate } from '@/app/_services/formatProfileDate.service'
import { Input } from '@/components/ui/input'
import { ArrowLeft, CircleCheck, CircleX, Save } from 'lucide-react'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import axios from 'axios'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Card } from '@/components/ui/card'
import { getBearerHeader } from '@/app/_services/getBearerHeader.service'

export default function EditProfilePage() {
  const router = useRouter()
  const currentUser = useSelector(selectUser)
  const [name, setName] = useState(currentUser.name)
  const [username, setUsername] = useState(currentUser.username)
  const [oldUsername] = useState(currentUser.username)
  const [email, setEmail] = useState(currentUser.email)
  const [profilePict, setProfilePict] = useState(
    `${apiUrl}/${currentUser.profile_pict}`
  )
  const [fotoProfil, setFotoProfil] = useState<File | undefined>()

  const [dialogMsg, setDialogMsg] = useState('')
  const [errDialog, setErrDialog] = useState(false)
  const [dialogType, setDialogType] = useState(1)

  const handleSubmit = async () => {
    const formData = new FormData()
    formData.append('name', name)
    formData.append('username', username)
    formData.append('email', email)
    formData.append('old_username', oldUsername)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    formData.append('profile_pict', fotoProfil)

    try {
      const updateResponse = await axios.put(
        `${apiUrl}/users`,
        formData,
        getBearerHeader(localStorage.getItem('token')!)
      )

      setDialogType(1)
      setErrDialog(true)
      setDialogMsg(updateResponse.data.message)
    } catch (err: any) {
      setDialogType(0)
      setErrDialog(true)
      setDialogMsg(err.response.data.message)
    }
  }

  const getAlertTitle = () => {
    if (dialogType == 1) {
      return (
        <>
          <CircleCheck className={'mb-3 text-green-500'} size={38} />
          Success
        </>
      )
    }

    if (dialogType == 0) {
      return (
        <>
          <CircleX className={'mb-3 text-red-600'} size={38} />
          Failed
        </>
      )
    }

    return ''
  }

  return (
    <ContentLayout title={'Edit Profile'}>
      <Card
        id={'card-utama'}
        className={
          'flex flex-col items-center justify-center gap-3 md:gap-5 p-5 h-[calc(100vh-180px)] rounded-lg shadow'
        }
      >
        <Avatar className={'w-24 h-24 md:w-48 md:h-48'}>
          <AvatarImage className={'object-cover'} src={profilePict} />
          <AvatarFallback>{getUserInitials(name)}</AvatarFallback>
        </Avatar>

        <div className={'flex flex-col w-full max-w-lg'}>
          <Input
            className={'w-full'}
            onChange={(e) => {
              setProfilePict(URL.createObjectURL(e.target.files![0]))
              setFotoProfil(e.target.files![0])
            }}
            type={'file'}
          />
          <span className={'text-xs ms-2 text-yellow-600'}>
            *Direkomendasikan untuk menggunakan gambar dengan ukuran 1:1 dan
            &lt;= 2MB.
          </span>
        </div>

        <div className={'max-w-xl w-full'}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className={'font-bold'}>Email</TableCell>
                <TableCell>
                  <Input
                    value={email}
                    type={'email'}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={'font-bold'}>Nama</TableCell>
                <TableCell>
                  <Input
                    value={name}
                    type={'text'}
                    onChange={(e) => setName(e.target.value)}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={'font-bold lg:w-32'}>Username</TableCell>
                <TableCell>
                  <Input
                    value={username}
                    type={'text'}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={'font-bold'}>Bergabung Pada</TableCell>
                <TableCell>
                  {formatProfileDate(currentUser.created_at)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className={'flex gap-3'}>
          <Button onClick={handleSubmit}>
            <Save /> Save
          </Button>
          <Button variant={'secondary'} asChild={true}>
            <Link href={'/main/profile'}>
              <ArrowLeft /> Back
            </Link>
          </Button>
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
                  router.push('/main/profile')
                }}
              >
                OK
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Card>
    </ContentLayout>
  )
}
