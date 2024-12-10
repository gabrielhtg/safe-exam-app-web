'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CircleCheck, CircleX, KeyRound, Pencil } from 'lucide-react'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { useSelector } from 'react-redux'
import { selectUser } from '@/lib/_slices/userSlice'
import { getUserInitials } from '@/app/_services/getUserInitials.service'
import { apiUrl } from '@/lib/env'
import { formatProfileDate } from '@/app/_services/formatProfileDate.service'
import { Card } from '@/components/ui/card'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import axios from 'axios'
import { getBearerHeader } from '@/app/_services/getBearerHeader.service'

export default function ProfilePage() {
  const currentUser = useSelector(selectUser)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [reNewPassword, setReNewPassword] = useState('')

  const [dialogMsg, setDialogMsg] = useState('')
  const [errDialog, setErrDialog] = useState(false)
  const [dialogType, setDialogType] = useState(1)

  const handleChangePassword = async () => {
    try {
      const response = await axios.patch(
        `${apiUrl}/users/password`,
        {
          old_password: oldPassword,
          new_password: newPassword,
          re_new_password: reNewPassword,
          username: currentUser.username,
        },
        getBearerHeader(localStorage.getItem('token')!)
      )

      setDialogType(1)
      setErrDialog(true)
      setDialogMsg(response.data.message)
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
    <ContentLayout title="Profile">
      <Card
        id={'card-utama'}
        className={
          'flex flex-col items-center justify-center gap-3 md:gap-5 p-5 h-[calc(100vh-180px)] rounded-lg shadow'
        }
      >
        <Avatar className={'w-24 h-24 md:w-48 md:h-48'}>
          <AvatarImage
            className={'object-cover'}
            src={`${apiUrl}/${currentUser.profile_pict}`}
          />
          <AvatarFallback>{getUserInitials(currentUser.name)}</AvatarFallback>
        </Avatar>

        <span className={'font-bold text-xl md:text-3xl'}>
          {currentUser.name}
        </span>

        <div className={'w-[270px] md:w-auto'}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className={'font-bold'}>Email</TableCell>
                <TableCell>{currentUser.email}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={'font-bold lg:w-32'}>Username</TableCell>
                <TableCell>{currentUser.username}</TableCell>
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
          <Button asChild={true}>
            <Link href={'/main/profile/edit'}>
              <Pencil /> Edit
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger>
              <Button>
                <KeyRound />
                Change Password
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Change Password</AlertDialogTitle>
                <AlertDialogDescription className={'flex flex-col gap-5 mt-3'}>
                  <div className="grid w-full items-center gap-1.5 mt-3">
                    <Label htmlFor="old-password">Old Password</Label>
                    <Input
                      type="password"
                      id="old-password"
                      onChange={(e) => {
                        setOldPassword(e.target.value)
                      }}
                    />
                  </div>

                  <div className="grid w-full items-center gap-1.5 ">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      type="password"
                      id="password"
                      onChange={(e) => {
                        setNewPassword(e.target.value)
                      }}
                    />
                  </div>

                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="re-password">Re-Enter Password</Label>
                    <Input
                      type="password"
                      id="re-password"
                      onChange={(e) => {
                        setReNewPassword(e.target.value)
                      }}
                    />
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleChangePassword}>
                  Save
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </Card>

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
              }}
            >
              OK
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ContentLayout>
  )
}
