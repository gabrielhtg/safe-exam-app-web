'use client'

import { Card } from '@/components/ui/card'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import React, { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Copy, Dices, Trash2 } from 'lucide-react'
import axios from 'axios'
import { apiUrl, feUrl } from '@/lib/env'
import { getBearerHeader } from '@/app/_services/getBearerHeader.service'
import { Label } from '@/components/ui/label'
import { toast, Toaster } from 'sonner'
import { formatExamDate } from '@/app/_services/format-exam-date'

export default function ManageAccess({ params }: any) {
  const courseId = params.id
  const [courseData, setCourseData] = useState<any>(null)
  const [allowedStudentData, setAllowedStudentData] = useState<any>([])

  const getCourse = async () => {
    try {
      const response = await axios.get(`${apiUrl}/course/${courseId}`, {
        headers: getBearerHeader(localStorage.getItem('token')!).headers,
      })

      setCourseData(response.data.data)
    } catch (e: any) {
      console.log(e)
    }
  }

  const getAllowedStudent = async () => {
    try {
      const response = await axios.get(`${apiUrl}/allowed-student`, {
        params: {
          course_id: courseId,
        },
        headers: getBearerHeader(localStorage.getItem('token')!).headers,
      })

      setAllowedStudentData(response.data.data)
    } catch (e: any) {
      console.log(e)
    }
  }

  const generateNewToken = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/course/generate-new-token`,
        {
          id: courseData.id,
        },
        getBearerHeader(localStorage.getItem('token')!)
      )

      setCourseData(response.data.data)
    } catch (e: any) {
      console.log(e)
    }
  }

  const handleDeleteAllowedStudentData = async (id: any) => {
    try {
      const response = await axios.delete(`${apiUrl}/allowed-student/${id}`, {
        headers: getBearerHeader(localStorage.getItem('token')!).headers,
      })

      getAllowedStudent().then()

      toast.success(response.data.message)
    } catch (e: any) {
      console.log(e)
    }
  }

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (e: any) {
      console.log(e)
    }
  }

  useEffect(() => {
    getCourse().then()
    getAllowedStudent().then()
  }, [])

  return (
    <ContentLayout title="Course">
      <Card
        id={'card-utama'}
        className={
          'flex flex-col gap-3 md:gap-5 p-10 min-h-[calc(100vh-180px)] rounded-lg shadow'
        }
      >
        <h1 className={'font-bold text-3xl'}>Allowed User</h1>

        <div className={'flex flex-col'}>
          <Label className={'font-semibold mb-2'}>Enroll Key</Label>
          <div className={'flex gap-3'}>
            <div className={'border rounded-lg py-2 px-5 font-mono'}>
              {courseData?.enroll_key}
            </div>
            <div className={'flex gap-3'}>
              <Button
                variant={'secondary'}
                onClick={() => {
                  handleCopy(courseData?.enroll_key).then()
                  toast.success('Register token copied.')
                }}
              >
                <Copy />
              </Button>
              <Button
                variant={'secondary'}
                onClick={() => {
                  generateNewToken().then()
                  toast.success('New token generated!')
                }}
              >
                <Dices />
              </Button>
            </div>
          </div>
        </div>

        <div className={'flex flex-col'}>
          <Label className={'font-semibold mb-2'}>Enroll Link</Label>
          <div className={'flex gap-3'}>
            <div className={'border rounded-lg py-2 px-5 font-mono'}>
              {`${feUrl}/allowed-student-register/${courseId}`}
            </div>
            <div>
              <Button
                variant={'secondary'}
                onClick={() => {
                  handleCopy(
                    `${feUrl}/allowed-student-register/${courseId}`
                  ).then()
                  toast.success('Register link copied')
                }}
              >
                <Copy />
              </Button>
            </div>
          </div>
        </div>

        <div className={'border rounded-lg'}>
          <Table>
            <TableHeader>
              <TableRow className={'divide-x'}>
                <TableHead>NIM</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Device ID</TableHead>
                <TableHead>Registered At</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allowedStudentData.length > 0 ? (
                <>
                  {allowedStudentData.map((data: any, index: number) => (
                    <TableRow key={index} className={'divide-x'}>
                      <TableCell>{data.nim}</TableCell>
                      <TableCell>{data.name}</TableCell>
                      <TableCell>{data.device_id}</TableCell>
                      <TableCell>{formatExamDate(data.created_at)}</TableCell>
                      <TableCell>
                        <Button
                          onClick={() => {
                            handleDeleteAllowedStudentData(data.id).then()
                          }}
                        >
                          <Trash2 />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className={'text-center p-3 text-muted-foreground'}
                  >
                    No Data
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Toaster />
    </ContentLayout>
  )
}