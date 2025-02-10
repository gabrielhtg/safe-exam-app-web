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
import {
  ArrowLeft,
  CircleX,
  Copy,
  Dices,
  RefreshCcw,
  Search,
  Trash2,
} from 'lucide-react'
import axios from 'axios'
import { getBearerHeader } from '@/app/_services/getBearerHeader.service'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { formatExamDate } from '@/app/_services/format-exam-date'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'

export default function ManageAccess({ params }: any) {
  const courseId = params.id
  const [courseData, setCourseData] = useState<any>(null)
  const [allowedStudentData, setAllowedStudentData] = useState<any>([])
  const [searchKeywords, setSearchKeywords] = useState('')
  const router = useRouter()

  const getCourse = async () => {
    try {
      const response = await axios.get(
        `${process.env.API_URL}/course/${courseId}`,
        {
          headers: getBearerHeader(localStorage.getItem('token')!).headers,
        }
      )

      setCourseData(response.data.data)
    } catch (e: any) {
      toast.error(e.response.data.message)
    }
  }

  const getAllowedStudent = async () => {
    try {
      const response = await axios.get(
        `${process.env.API_URL}/allowed-student`,
        {
          params: {
            course_id: courseId,
          },
          headers: getBearerHeader(localStorage.getItem('token')!).headers,
        }
      )

      setAllowedStudentData(response.data.data)
    } catch (e: any) {
      toast.error(e.response.data.message)
    }
  }

  const generateNewToken = async () => {
    try {
      const response = await axios.post(
        `${process.env.API_URL}/course/generate-new-token`,
        {
          id: courseData.id,
        },
        getBearerHeader(localStorage.getItem('token')!)
      )

      setCourseData(response.data.data)
    } catch (e: any) {
      toast.error(e.response.data.message)
    }
  }

  const handleDeleteAllowedStudentData = async (id: any) => {
    try {
      const response = await axios.delete(
        `${process.env.API_URL}/allowed-student/${id}`,
        {
          headers: getBearerHeader(localStorage.getItem('token')!).headers,
        }
      )

      getAllowedStudent().then()

      toast.success(response.data.message)
    } catch (e: any) {
      toast.error(e.response.data.message)
    }
  }

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (e: any) {
      toast.error(e.response.data.message)
    }
  }

  const searchAllowedUser = async () => {
    try {
      const response = await axios.get(
        `${process.env.API_URL}/allowed-student`,
        {
          params: {
            course_id: courseId,
            search: searchKeywords,
          },
          headers: getBearerHeader(localStorage.getItem('token')!).headers,
        }
      )

      setAllowedStudentData(response.data.data)
    } catch (e: any) {
      toast.error(e.response.data.message)
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
              {`${process.env.FE_URL}/allowed-student-register/${courseId}`}
            </div>
            <div>
              <Button
                variant={'secondary'}
                onClick={() => {
                  handleCopy(
                    `${process.env.FE_URL}/allowed-student-register/${courseId}`
                  ).then()
                  toast.success('Register link copied')
                }}
              >
                <Copy />
              </Button>
            </div>
          </div>
        </div>

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
              searchAllowedUser().then()
            }}
          >
            <Search /> Search
          </Button>

          {searchKeywords !== '' ? (
            <Button
              onClick={() => {
                setSearchKeywords('')
                getAllowedStudent().then()
              }}
            >
              <CircleX /> Clear
            </Button>
          ) : (
            ''
          )}

          <Button
            onClick={() => {
              getAllowedStudent().then()
              toast.success('Fresh from the oven.')
            }}
          >
            <RefreshCcw /> Refresh
          </Button>

          <Button
            onClick={() => {
              router.back()
            }}
          >
            <ArrowLeft /> Back
          </Button>
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
    </ContentLayout>
  )
}
