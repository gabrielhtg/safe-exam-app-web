'use client'

import React, { useEffect, useState } from 'react'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import axios from 'axios'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { formatExamDate } from '@/app/_services/format-exam-date'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
// import { getBearerHeader } from '@/app/_services/getBearerHeader.service'
import { Copy } from 'lucide-react'
import parse from 'html-react-parser'

export default function ShareExam({ params }: any) {
  const examID = params.id
  const [examData, setExamData] = useState<any>()
  const [timeLimit, setTimeLimit] = useState('')

  const handleGetExam = async () => {
    try {
      const response = await axios.get(`${process.env.API_URL}/exam/${examID}`)

      if (response.status === 200) {
        setExamData(response.data.data)
        const tempTimeLimitHours = Math.floor(
          response.data.data.time_limit / 3600
        )
        const tempTimeLimitMinutes = Math.floor(
          (response.data.data.time_limit % 3600) / 60
        )
        const tempTimeLimitSeconds = Math.floor(
          (response.data.data.time_limit % 3600) % 60
        )

        if (
          response.data.data.time_limit === 0 ||
          response.data.data.time_limit === null
        ) {
          setTimeLimit('Not set')
        } else {
          setTimeLimit(
            `${tempTimeLimitHours} hours, ${tempTimeLimitMinutes} minutes, ${tempTimeLimitSeconds} seconds`
          )
        }
      }
    } catch (e: any) {
      toast.error(`Error getting exam: ${e.response.data.message}`)
    }
  }

  // const handleDownloadExamFile = async (examId: number) => {
  //   try {
  //     const response = await axios.get(
  //       `${process.env.API_URL}/exam/generate-file`,
  //       {
  //         params: {
  //           id: examId,
  //         },
  //         headers: getBearerHeader(localStorage.getItem('token')!).headers,
  //       }
  //     )
  //
  //     if (response.status == 200) {
  //       window.location.href = `${process.env.API_URL}/${response.data.data}`
  //     }
  //   } catch (err: any) {
  //     toast.error(err.response.data.message)
  //   }
  // }

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (e: any) {
      toast.error(e.response.data.message)
    }
  }

  useEffect(() => {
    handleGetExam().then()
  }, [])

  return (
    <div
      className={'w-full h-screen flex flex-col items-center justify-center'}
    >
      <h1 className={'font-bold text-2xl mb-5'}>
        {examData?.course.title} - {examData?.title}
      </h1>

      <div className={'flex flex-col items-center mb-5'}>
        <div>{examData?.description ? parse(examData?.description) : ''}</div>

        <div className={'border rounded-lg mb-5'}>
          <Table className={'max-w-xl text-base'}>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Attempts allowed</TableCell>
                <TableCell>:</TableCell>
                <TableCell>{examData?.allowed_attempts}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  This quiz started on
                </TableCell>
                <TableCell>:</TableCell>
                <TableCell>{formatExamDate(examData?.start_date)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  This quiz closed on
                </TableCell>
                <TableCell>:</TableCell>
                <TableCell>{formatExamDate(examData?.end_date)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Time Limit</TableCell>
                <TableCell>:</TableCell>
                <TableCell>{timeLimit}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Config Password</TableCell>
                <TableCell>:</TableCell>
                <TableCell className={'font-mono'}>
                  <div className={'flex gap-3 items-center'}>
                    {examData?.config_password}
                    <Button
                      variant={'outline'}
                      onClick={() => {
                        handleCopy(examData?.config_password).then()
                        toast.success('Config password copied!')
                      }}
                    >
                      <Copy />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/*<Button*/}
        {/*  onClick={() => {*/}
        {/*    handleDownloadExamFile(examID)*/}
        {/*  }}*/}
        {/*>*/}
        {/*  <FileCog /> Download Configuration File*/}
        {/*</Button>*/}
      </div>

      <div>
        <span>
          Haven&#39;t registered for this course yet? Enroll{' '}
          <Link
            href={`/allowed-student-register/${examData?.course.id}`}
            className={'text-blue-600'}
          >
            here
          </Link>
          .
        </span>
      </div>
      <Toaster richColors />
    </div>
  )
}
