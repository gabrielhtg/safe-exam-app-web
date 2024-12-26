'use client'

import { Card } from '@/components/ui/card'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import React, { useEffect, useState } from 'react'
import 'react-quill/dist/quill.snow.css'
import { getBearerHeader } from '@/app/_services/getBearerHeader.service'
import axios from 'axios'
import { apiUrl } from '@/lib/env'
import { Button } from '@/components/ui/button'
import { CircleCheck, CircleX } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import parse from 'html-react-parser'
import { format } from 'date-fns'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'

export default function SimulatePage({ params }: any) {
  const id = params.id
  const [examData, setExamData] = useState<any>(null)
  const [dialogMsg, setDialogMsg] = useState('')
  const [showDialog, setShowDialog] = useState(false)
  const [dialogType, setDialogType] = useState(1)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [timeLimit, setTimeLimit] = useState('')
  const [inputStartPassword, setInputStartPassword] = useState('')
  const [inputStartPasswordValidation, setInputStartPasswordValidation] =
    useState('')
  const router = useRouter()

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

  const getExamData = async () => {
    const response = await axios.get(
      `${apiUrl}/exam/${id}`,
      getBearerHeader(localStorage.getItem('token')!)
    )

    setExamData(response.data.data)
    setStartDate(
      format(
        new Date(response.data.data.start_date),
        'EEEE, dd MMMM yyyy, hh:mm a'
      )
    )
    setEndDate(
      format(
        new Date(response.data.data.end_date),
        'EEEE, dd MMMM yyyy, hh:mm a'
      )
    )
    const tempTimeLimitHours = Math.floor(response.data.data.time_limit / 3600)
    const tempTimeLimitMinutes = Math.floor(
      (response.data.data.time_limit % 3600) / 60
    )
    const tempTimeLimitSeconds = Math.floor(
      (response.data.data.time_limit % 3600) % 60
    )

    setTimeLimit(
      `${tempTimeLimitHours} hours, ${tempTimeLimitMinutes} minutes, ${tempTimeLimitSeconds} seconds`
    )
  }

  useEffect(() => {
    getExamData().then()
  }, [])

  return (
    <ContentLayout title="Configure Exam">
      <Card
        id={'card-utama'}
        className={'w-full p-10 min-h-[calc(100vh-180px)] gap-5 flex flex-col'}
      >
        <h1 className={'font-bold text-3xl'}>
          Course : {examData ? examData.course_title : ''}
        </h1>

        <hr />

        <h2 className={'font-bold text-2xl'}>
          {examData ? examData.title : ''}
        </h2>

        <div className={'list-disc'}>
          {parse(examData ? examData.description : '')}
        </div>

        <hr />

        <div
          className={'w-full flex justify-center items-center flex-col gap-3'}
        >
          <div className={'border rounded-lg'}>
            <Table className={'max-w-lg text-base'}>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Attemps allowed</TableCell>
                  <TableCell>:</TableCell>
                  <TableCell>{examData?.allowed_attemps}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    This quiz started on
                  </TableCell>
                  <TableCell>:</TableCell>
                  <TableCell>{startDate}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    This quiz closed on
                  </TableCell>
                  <TableCell>:</TableCell>
                  <TableCell>{endDate}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Time Limit</TableCell>
                  <TableCell>:</TableCell>
                  <TableCell>{timeLimit}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Start Exam</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className={'mb-5'}>
                    Enter Start Password
                  </DialogTitle>
                  <DialogDescription className={'text-base text-primary'}>
                    Enter the password to start the exam. Ask the teacher/exam
                    supervisor for the password if you haven&#39;t got it.
                    <Input
                      value={inputStartPassword}
                      onChange={(e) => {
                        setInputStartPassword(e.target.value)
                      }}
                      type={'password'}
                      className={'mt-3'}
                      autoComplete={'new-password'}
                    />
                    <span className={'text-sm text-red-400'}>
                      {inputStartPasswordValidation}
                    </span>
                    <div className={'mt-3 flex gap-3'}>
                      <Button
                        onClick={() => {
                          setInputStartPasswordValidation('')
                          if (examData.start_password === inputStartPassword) {
                            router.push(`/main/exam/simulate/start/${id}`)
                          } else {
                            setInputStartPasswordValidation(
                              'Incorrect Start Password'
                            )
                          }
                        }}
                      >
                        Start
                      </Button>
                      <Button variant={'secondary'}>Cancel</Button>
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </Card>

      <AlertDialog open={showDialog}>
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
                setShowDialog(false)
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
