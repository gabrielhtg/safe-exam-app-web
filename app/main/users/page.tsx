'use client'

import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import axios from 'axios'
import { getBearerHeader } from '@/app/_services/getBearerHeader.service'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatExamDate } from '@/app/_services/format-exam-date'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getUserInitials } from '@/app/_services/getUserInitials.service'
import { CircleX, RefreshCcw, Search, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function UsersPage() {
  const [usersData, setUsersData] = useState<any>([])
  const router = useRouter()
  const [searchKeywords, setSearchKeywords] = useState('')

  const getUserData = async () => {
    try {
      const response = await axios.get(
        `${process.env.API_URL}/users/${localStorage.getItem('username')}`,
        getBearerHeader(localStorage.getItem('token')!)
      )

      if (response.data.data.role !== 'ADMIN') {
        router.push('/main')
      }
    } catch (e: any) {
      toast.error(e.response.message)
    }
  }

  const getUsersData = async () => {
    try {
      const response = await axios.get(
        `${process.env.API_URL}/users`,
        getBearerHeader(localStorage.getItem('token')!)
      )

      setUsersData(response.data.data)
    } catch (e: any) {
      toast.error(e.response.message)
    }
  }

  const handleRemoveUser = async (username: string) => {
    try {
      const response = await axios.delete(
        `${process.env.API_URL}/users/${username}`,
        getBearerHeader(localStorage.getItem('token')!)
      )

      toast.success(response.data.message)
      getUsersData().then()
    } catch (e: any) {
      toast.error(e.response.message)
    }
  }

  useEffect(() => {
    getUserData().then()
    getUsersData().then()
  }, [])

  return (
    <ContentLayout title="Profile">
      <Card
        id={'card-utama'}
        className={'w-full p-10 min-h-[calc(100vh-180px)]'}
      >
        <h3 className={'font-bold mb-5 text-2xl'}>Users List</h3>

        <div className={'flex gap-1'}>
          <Input
            type={'text'}
            className={'max-w-lg'}
            value={searchKeywords}
            placeholder={'Search here...'}
            onChange={(e) => {
              setSearchKeywords(e.target.value)
            }}
          />

          <Button
            onClick={() => {
              // searchExam().then()
            }}
          >
            <Search /> Search
          </Button>

          {searchKeywords !== '' ? (
            <Button
              onClick={() => {
                setSearchKeywords('')
                getUsersData().then()
              }}
            >
              <CircleX /> Clear
            </Button>
          ) : (
            ''
          )}

          <Button
            onClick={() => {
              getUsersData().then()
              toast.success('Fresh from the oven.')
            }}
          >
            <RefreshCcw /> Refresh
          </Button>
        </div>

        <div className={'border rounded-lg'}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Registered At</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usersData.map((user: any, index: number) => (
                <TableRow key={index}>
                  <TableCell className={'flex gap-3 items-center'}>
                    <Avatar>
                      <AvatarImage
                        src={user.profile_pict ? user.profile_pict : null}
                      />
                      <AvatarFallback>
                        {getUserInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    {user.name}
                  </TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{formatExamDate(user.created_at)}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => {
                        handleRemoveUser(user.username).then()
                      }}
                    >
                      <Trash />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </ContentLayout>
  )
}
