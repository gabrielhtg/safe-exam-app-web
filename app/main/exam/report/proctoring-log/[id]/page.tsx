'use client'

import React, { useEffect, useState } from 'react'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import axios from 'axios'
import { apiUrl } from '@/lib/env'
import { getBearerHeader } from '@/app/_services/getBearerHeader.service'
import { toast } from 'sonner'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'

export default function ProctoringLog({ params }: any) {
  const examResultId = params.id
  const [examResultData, setExamResultData] = useState<any>()
  const [proctoringLogData, setProctoringLogData] = useState<any[]>([])
  const [allowedStudentData, setAllowedStudentData] = useState([])
  const router = useRouter()

  const getExamResult = async () => {
    try {
      const requestResult = await axios.get(
        `${apiUrl}/exam-result/${examResultId}`,
        getBearerHeader(localStorage.getItem('token')!)
      )

      setExamResultData(requestResult.data.data)
      setProctoringLogData(requestResult.data.data.proctoring_logs)

      getAllowedStudent(requestResult.data.data.exam.course_id).then()
    } catch (e: any) {
      toast.error(e.response.data.message)
    }
  }

  const getNameByNim = (user_username: string) => {
    const person: any = allowedStudentData.find(
      (item: any) => item.nim === user_username
    )

    return person ? person.name : null
  }

  const getDeviceId = (user_username: string) => {
    const person: any = allowedStudentData.find(
      (item: any) => item.nim === user_username
    )

    return person ? person.device_id : null
  }

  const formatLogtime = (dateString: string) => {
    const date = new Date(dateString)

    const formattedDate = date.toLocaleDateString('en-US', {
      weekday: 'long',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })

    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })

    return `${formattedDate}, ${formattedTime} WIB`
  }

  const getAllowedStudent = async (courseId: string) => {
    try {
      const response = await axios.get(`${apiUrl}/allowed-student`, {
        params: {
          course_id: courseId,
        },
        headers: getBearerHeader(localStorage.getItem('token')!).headers,
      })

      setAllowedStudentData(response.data.data)
    } catch (e: any) {
      toast.error(e.response.data.message)
    }
  }

  useEffect(() => {
    getExamResult().then()
  }, [])

  return (
    <>
      <ContentLayout title="Exam">
        <Card
          id={'card-utama'}
          className={'w-full p-10 min-h-[calc(100vh-180px)]'}
        >
          <h3 className={'font-bold mb-5 text-3xl'}>Proctoring Log</h3>

          <div className={'flex gap-3 mb-3'}>
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
              <TableBody>
                <TableRow className={'divide-x'}>
                  <TableCell className={'font-bold'}>NIM</TableCell>
                  <TableCell>{examResultData?.user_username}</TableCell>
                </TableRow>
                <TableRow className={'divide-x'}>
                  <TableCell className={'font-bold'}>NAME</TableCell>
                  <TableCell>
                    {getNameByNim(examResultData?.user_username)}
                  </TableCell>
                </TableRow>
                <TableRow className={'divide-x'}>
                  <TableCell className={'font-bold'}>COURSE</TableCell>
                  <TableCell>{examResultData?.exam.course.title}</TableCell>
                </TableRow>
                <TableRow className={'divide-x'}>
                  <TableCell className={'font-bold'}>EXAM</TableCell>
                  <TableCell>{examResultData?.exam.title}</TableCell>
                </TableRow>
                <TableRow className={'divide-x'}>
                  <TableCell className={'font-bold'}>DEVICE ID</TableCell>
                  <TableCell>
                    {getDeviceId(examResultData?.user_username)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className={'border rounded-lg w-full mt-3'}>
            <Table>
              <TableHeader>
                <TableRow className={'divide-x'}>
                  <TableHead>No.</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>User Capture</TableHead>
                  <TableHead>Screen Capture</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {proctoringLogData.length > 0 ? (
                  proctoringLogData.map((data: any, index: number) => (
                    <TableRow key={index} className={'divide-x'}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{formatLogtime(data.time)}</TableCell>
                      <TableCell>{data.description}</TableCell>
                      <TableCell className={'p-5'}>
                        {data.description ===
                        'The examinee was detected changing window.' ? (
                          'No user image'
                        ) : (
                          <Image
                            src={`${apiUrl}/${data.user_image}`}
                            alt={'user-image'}
                            width={500}
                            height={500}
                            className={'w-58 rounded-lg'}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger>
                            <Image
                              src={`${apiUrl}/${data.screen_image}`}
                              alt={'user-image'}
                              width={500}
                              height={500}
                              className={'border rounded-lg'}
                            />
                          </DialogTrigger>
                          <DialogContent
                            className={
                              'w-10/12 max-w-full flex justify-center h-[calc(100vh-100px)]'
                            }
                          >
                            <Image
                              src={`${apiUrl}/${data.screen_image}`}
                              className={'border rounded-lg w-10/12'}
                              alt={'user-image'}
                              width={2000}
                              height={2000}
                            />
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className={'p-5 text-center'}>
                      No Data
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </ContentLayout>
    </>
  )
}
