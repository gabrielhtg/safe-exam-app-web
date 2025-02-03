'use client'

import { Card } from '@/components/ui/card'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import React, { useEffect, useState } from 'react'
import 'react-quill/dist/quill.snow.css'
import { getBearerHeader } from '@/app/_services/getBearerHeader.service'
import axios from 'axios'
import { apiUrl } from '@/lib/env'
import { Button } from '@/components/ui/button'
import parse from 'html-react-parser'
import { format } from 'date-fns'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
import { useSelector } from 'react-redux'
import { selectUser } from '@/lib/_slices/userSlice'
import Link from 'next/link'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { BackButton } from '@/components/custom-component/BackButton'

export default function SimulatePage({ params }: any) {
  const id = params.id
  const [examData, setExamData] = useState<any>(null)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [timeLimit, setTimeLimit] = useState('')
  const [inputStartPassword, setInputStartPassword] = useState('')
  const currentUsername = useSelector(selectUser).username
  const [showNoQuestionDialog, setShowNoQuestionDialog] = useState(false)
  const [inputStartPasswordValidation, setInputStartPasswordValidation] =
    useState('')
  const [examResultData, setExamResultData] = useState<any[]>([])
  const [question, setQuestion] = useState<any>(null)
  const [showTimeLimitDialog, setShowTimeLimitDialog] = useState<boolean>(false)
  const router = useRouter()

  const getExamData = async () => {
    try {
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

      const examResultResponse = await axios.get(`${apiUrl}/exam-result`, {
        params: {
          username: currentUsername,
          exam: response.data.data.id,
        },
        headers: getBearerHeader(localStorage.getItem('token')!).headers,
      })

      console.log(examResultResponse.data.data)

      setExamResultData(examResultResponse.data.data)

      const getQuestionResponse = await axios.get(
        `${apiUrl}/question${response.data.data.shuffle_questions ? '/shuffled' : ''}`,
        {
          params: {
            exam: id,
          },
          headers: getBearerHeader(localStorage.getItem('token')!).headers,
        }
      )

      setQuestion(getQuestionResponse.data.data)
    } catch (e: any) {
      console.log(e)
    }
  }

  const handleResetAttempt = async () => {
    try {
      await axios.delete(`${apiUrl}/exam-result/reset`, {
        params: {
          username: currentUsername,
          exam_id: examData.id,
        },
        headers: getBearerHeader(localStorage.getItem('token')!).headers,
      })

      const examResultResponse = await axios.get(`${apiUrl}/exam-result`, {
        params: {
          username: currentUsername,
          exam: examData.id,
        },
        headers: getBearerHeader(localStorage.getItem('token')!).headers,
      })

      setExamResultData(examResultResponse.data.data)
    } catch (e: any) {
      console.log(e)
    }
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
          Course : {examData ? examData.course.title : ''}
        </h1>

        <hr />

        <h2 className={'font-bold text-2xl'}>
          {examData ? examData.title : ''}
        </h2>

        <div className={'list-disc'}>
          {parse(examData ? examData.description : '')}
        </div>

        <div className={'w-full flex justify-center items-center'}>
          <div className={'border rounded-lg'}>
            <Table className={'max-w-lg text-base'}>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">
                    Attempts allowed
                  </TableCell>
                  <TableCell>:</TableCell>
                  <TableCell>{examData?.allowed_attempts}</TableCell>
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
        </div>

        {examResultData.filter((item) => item.username === currentUsername)
          .length > 0 ? (
          <>
            <hr />

            <h2 className={'font-bold text-2xl'}>Attempt Summary</h2>

            <div className={'border rounded-lg'}>
              <Table>
                <TableHeader>
                  <TableRow className={'divide-x'}>
                    <TableHead>Attempt</TableHead>
                    <TableHead>Submitted At</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Review</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {examResultData?.map((examResult, index: number) => (
                    <TableRow key={index} className={'divide-x'}>
                      <TableCell>{examResult.attempt}</TableCell>
                      <TableCell>
                        {format(
                          new Date(examResult.created_at),
                          'EEEE, dd MMMM yyyy, hh:mm a'
                        )}
                      </TableCell>
                      <TableCell>
                        {examResult.total_score} / {examResult.expected_score} (
                        <span className={'font-bold'}>
                          {(
                            (examResult.total_score /
                              examResult.expected_score) *
                            100
                          ).toFixed(2)}
                          %)
                        </span>
                      </TableCell>
                      <TableCell>
                        {examData.enable_review ? (
                          <Link
                            href={`/main/exam/simulate/review/${examResult.id}`}
                            className={'text-blue-500'}
                          >
                            Review
                          </Link>
                        ) : (
                          'Not Allowed'
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        ) : (
          ''
        )}

        <div className={'flex justify-center gap-3'}>
          {examResultData?.filter((item) => item.username === currentUsername)
            .length >= examData?.allowed_attempts ? (
            ''
          ) : (
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    if (
                      !(
                        examResultData.filter(
                          (item) => item.username === currentUsername
                        ).length > 0
                      )
                    ) {
                      if (
                        examData.start_password === undefined ||
                        examData.start_password === null ||
                        examData.start_password === ''
                      ) {
                        router.push(`/main/exam/simulate/start/${id}`)
                      }
                    }
                  }}
                >
                  {examResultData.filter(
                    (item) => item.username === currentUsername
                  ).length > 0
                    ? 'Start Again'
                    : 'Start Exam'}
                </Button>
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
                          if (question.length > 0) {
                            if (
                              examData.time_limit === 0 ||
                              examData.time_limit === null
                            ) {
                              setShowTimeLimitDialog(true)
                            } else {
                              if (
                                examData.start_password === inputStartPassword
                              ) {
                                router.push(`/main/exam/simulate/start/${id}`)
                              } else {
                                setInputStartPasswordValidation(
                                  'Incorrect Start Password'
                                )
                              }
                            }
                          } else {
                            setShowNoQuestionDialog(true)
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
          )}

          {examResultData.filter((item) => item.username === currentUsername)
            .length > 0 ? (
            <Button
              onClick={() => {
                handleResetAttempt().then()
              }}
            >
              Reset Attempts
            </Button>
          ) : (
            ''
          )}

          <BackButton />
        </div>
      </Card>

      <AlertDialog open={showNoQuestionDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle
              className={'text-center flex flex-col items-center'}
            >
              Failed to Start
            </AlertDialogTitle>
            <AlertDialogDescription className={'text-center'}>
              No question added to this exam!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className={'!justify-center'}>
            <Button
              onClick={() => {
                setShowNoQuestionDialog(false)
                router.push(`/main/exam/question/${examData.id}`)
              }}
            >
              OK
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showTimeLimitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle
              className={'text-center flex flex-col items-center'}
            >
              Failed to Start
            </AlertDialogTitle>
            <AlertDialogDescription className={'text-center'}>
              Set time limit first!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className={'!justify-center'}>
            <Button
              onClick={() => {
                setShowTimeLimitDialog(false)
                router.push(`/main/exam/configure/${examData.id}`)
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
