'use client'

import { Card } from '@/components/ui/card'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import React, { useEffect, useState } from 'react'
import 'react-quill/dist/quill.snow.css'
import { getBearerHeader } from '@/app/_services/getBearerHeader.service'
import axios from 'axios'
import { apiUrl } from '@/lib/env'
import { Button } from '@/components/ui/button'
import { CircleCheck, CirclePlay, CircleX, RotateCcw, Save } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import dynamic from 'next/dynamic'
import { Input } from '@/components/ui/input'
import { TimePickerDemo } from '@/components/custom-component/time-picker-demo'
import Link from 'next/link'
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

export default function ExamConfigPage({ params }: any) {
  const id = params.id
  const [examData, setExamData] = useState<any>(null)
  const [dialogMsg, setDialogMsg] = useState('')
  const [showDialog, setShowDialog] = useState(false)
  const [dialogType, setDialogType] = useState(1)
  const [editorConfig, setEditorConfig] = useState<any>(null)

  // state untuk exam behaviour
  const [examDescription, setExamDescription] = useState('')
  const [startPassword, setStartPassword] = useState('')
  const [endPassword, setEndPassword] = useState('')
  const [enableProctoring, setEnableProctoring] = useState(false)
  const [reviewAnswer, setReviewAnswer] = useState(false)
  const [showExamGrade, setShowExamGrade] = useState(false)
  const [allowedAttemps, setAllowedAttemps] = useState(1)
  const [cheatingLimit, setCheatingLimit] = useState(5)
  const [passingGrade, setPassingGrade] = useState(75)
  const [timeLimit, setTimeLimit] = useState<Date>()

  // state untuk question behaviour
  const [isSequential, setIsSequential] = useState(false)
  const [shuffleOptions, setShuffleOptions] = useState(false)
  const [shuffleQuestions, setShuffleQuestions] = useState(false)

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
    setExamDescription(response.data.data.description)
    setEnableProctoring(response.data.data.enable_proctoring)
    setReviewAnswer(response.data.data.enable_review)
    setReviewAnswer(response.data.data.enable_review)
    setShowExamGrade(response.data.data.show_grade)
    setAllowedAttemps(response.data.data.allowed_attemps)
    setCheatingLimit(response.data.data.cheating_limit)
    setPassingGrade(response.data.data.passing_grade)
    setIsSequential(response.data.data.sequential)
    setShuffleQuestions(response.data.data.shuffle_questions)
    setShuffleOptions(response.data.data.shuffle_options)
    setStartPassword(response.data.data.start_password)
    setEndPassword(response.data.data.end_password)

    const tempDate = new Date()
    tempDate.setHours(
      Math.floor(response.data.data.time_limit / 3600),
      Math.floor((response.data.data.time_limit % 3600) / 60),
      Math.floor((response.data.data.time_limit % 3600) % 60)
    )

    setTimeLimit(tempDate)
  }

  const handleSaveConfig = async () => {
    setShowDialog(true)

    try {
      const saveResponse = await axios.patch(
        `${apiUrl}/exam/${id}`,
        {
          sequential: isSequential,
          shuffle_options: shuffleOptions,
          shuffle_questions: shuffleQuestions,
          enable_review: reviewAnswer,
          show_grade: showExamGrade,
          passing_grade: passingGrade,
          description: examDescription
            .replace(/<ul>/g, '<ul class="list-disc ms-4 list-inside">')
            .replace(/<ol>/g, '<ol class="list-decimal ms-4 list-inside">'),
          enable_proctoring: enableProctoring,
          allowed_attemps: allowedAttemps,
          cheating_limit: cheatingLimit,
          start_password: startPassword,
          end_password: endPassword,
          time_limit: timeLimit
            ? timeLimit.getHours() * 3600 +
              timeLimit.getMinutes() * 60 +
              timeLimit.getSeconds()
            : undefined,
        },
        getBearerHeader(localStorage.getItem('token')!)
      )

      if (saveResponse.status == 200) {
        setDialogType(1)
        setDialogMsg(saveResponse.data.message)
      }
      getExamData().then()
    } catch (e: any) {
      setDialogType(0)
      setDialogMsg(e.response.data)
    }
  }

  useEffect(() => {
    const loadQuill = async () => {
      const { Quill } = (await import('react-quill')).default
      const QuillResizeImage = (await import('quill-resize-image')).default

      Quill.register('modules/resize', QuillResizeImage)

      setEditorConfig({
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, 4, false] }],
            [{ font: [] }],
            [{ size: [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
            [
              { list: 'ordered' },
              { list: 'bullet' },
              { indent: '-1' },
              { indent: '+1' },
            ],
            ['link', 'image', 'video'],
            ['clean'],
          ],
          resize: {
            locale: {},
          },
        },
        formats: [
          'header',
          'bold',
          'italic',
          'underline',
          'strike',
          'blockquote',
          'list',
          'bullet',
          'indent',
          'link',
          'image',
        ],
      })
    }

    loadQuill().then()

    getExamData().then()
  }, [])

  return (
    <ContentLayout title="Configure Exam">
      <Card
        id={'card-utama'}
        className={'w-full p-10 min-h-[calc(100vh-180px)]'}
      >
        <h3 className={'font-bold text-xl mb-5'}>
          Configure {examData ? examData.title : ''}
        </h3>

        <div className="flex flex-col gap-3 mb-5">
          <h2 className={'font-bold'}>Exam Description</h2>
          {editorConfig ? (
            <ReactQuill
              theme="snow"
              value={examDescription}
              onChange={setExamDescription}
              modules={editorConfig.modules}
              formats={editorConfig.formats}
            />
          ) : (
            ''
          )}
        </div>

        <div className={'flex gap-3 flex-col mb-5'}>
          <div className={'p-5 border flex rounded-lg flex-col'}>
            <h2 className={'font-bold mb-5'}>Exam Behaviour</h2>

            <div
              className={'w-full grid sm:grid-cols-1 md:grid-cols-2 gap-16 '}
            >
              {/* Sebelah kiri */}
              <div className={'flex flex-col gap-8'}>
                <div className={'flex-col gap-3 flex'}>
                  <span className={'text-sm text-muted-foreground'}>
                    The &#34;Enable Proctoring&#34; input allows administrators
                    to activate monitoring features during the exam. This
                    feature ensures the integrity of the exam by supervising
                    participants&#39; activities through tools such as webcams,
                    screen recording, or activity logs.
                  </span>
                  <div className="items-center grid grid-cols-2 max-w-sm">
                    <Label htmlFor="enable-proctoring">Enable Proctoring</Label>
                    <Switch
                      id="enable-proctoring"
                      checked={enableProctoring}
                      onCheckedChange={setEnableProctoring}
                    />
                  </div>
                </div>

                <div className={'flex flex-col gap-3'}>
                  <span className={'text-sm text-muted-foreground'}>
                    The &#34;Review Answer&#34; input enables participants to
                    review and revise their answers before final submission.
                    This feature promotes careful review and reduces errors.
                  </span>
                  <div className="items-center grid grid-cols-2 max-w-sm">
                    <Label htmlFor="review-answer">Review Answer</Label>
                    <Switch
                      id="review-answer"
                      checked={reviewAnswer}
                      onCheckedChange={setReviewAnswer}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <span className={'text-sm text-muted-foreground'}>
                    The &#34;Show Exam Grade&#34; input determines whether
                    participants can view their exam grades immediately after
                    submission.
                  </span>
                  <div className="items-center grid grid-cols-2 max-w-sm">
                    <Label htmlFor="show-exam-grade">Show Exam Grade</Label>
                    <Switch
                      id="show-exam-grade"
                      checked={showExamGrade}
                      onCheckedChange={setShowExamGrade}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <span className={'text-sm text-muted-foreground'}>
                    The &#34;Allowed Attempts&#34; input specifies the maximum
                    number of times participants are permitted to retake the
                    exam.
                  </span>
                  <div className="items-center grid grid-cols-2 max-w-sm">
                    <Label htmlFor="shuffle-options">Allowed Attempts</Label>
                    <Input
                      value={allowedAttemps}
                      onChange={(e) => setAllowedAttemps(+e.target.value)}
                      type={'number'}
                      id="shuffle-options"
                      className={'w-[80px]'}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <span className={'text-sm text-muted-foreground'}>
                    The &#34;Cheating Limit&#34; input sets the threshold for
                    suspicious activity detected during the exam, such as
                    excessive window switching or idle time.
                  </span>
                  <div className="items-center grid grid-cols-2 max-w-sm">
                    <Label htmlFor="cheating-limit">Cheating Limit</Label>
                    <Input
                      value={cheatingLimit}
                      onChange={(e) => setCheatingLimit(+e.target.value)}
                      type={'number'}
                      id="cheating-limit"
                      className={'w-[80px]'}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <span className={'text-sm text-muted-foreground'}>
                    The &#34;Passing Grade&#34; input allows administrators to
                    define the minimum score required for participants to pass
                    the exam.
                  </span>
                  <div className="items-center grid grid-cols-2 max-w-sm">
                    <Label htmlFor="passing-grade">Passing Grade</Label>
                    <Input
                      value={passingGrade}
                      onChange={(e) => setPassingGrade(+e.target.value)}
                      type={'number'}
                      id="passing-grade"
                      className={'w-[80px]'}
                    />
                  </div>
                </div>
              </div>

              {/* Sebelah kanan */}
              <div className={'flex flex-col gap-3'}>
                <div className="flex flex-col gap-3">
                  <span className={'text-sm text-muted-foreground'}>
                    The &#34;Start Password&#34; input is a security measure
                    that requires participants to enter a password to begin the
                    exam.
                  </span>
                  <div className="items-center grid grid-cols-2 max-w-sm">
                    <Label>Start Password</Label>
                    <Input
                      value={startPassword}
                      onChange={(e) => setStartPassword(e.target.value)}
                      type={'text'}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <span className={'text-sm text-muted-foreground'}>
                    The &#34;End Password&#34; input is a security feature
                    requiring participants to enter a password to finalize and
                    submit their exam.
                  </span>
                  <div className="items-center grid grid-cols-2 max-w-sm">
                    <Label>End Password</Label>
                    <Input
                      value={endPassword}
                      onChange={(e) => setEndPassword(e.target.value)}
                      type={'text'}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <span className={'text-sm text-muted-foreground'}>
                    The &#34;Passing Grade&#34; input allows administrators to
                    define the minimum score required for participants to pass
                    the exam.
                  </span>
                  <div className="items-center grid grid-cols-2 max-w-sm">
                    <Label>Time Limit</Label>
                    <TimePickerDemo date={timeLimit} setDate={setTimeLimit} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={'flex flex-col mb-5'}>
          <div className={'p-5 border flex rounded-lg flex-col'}>
            <h2 className={'font-bold mb-5'}>Question Behaviour</h2>

            <div className={'flex flex-col gap-8'}>
              <div className="flex flex-col gap-3">
                <span className={'text-sm text-muted-foreground'}>
                  The &#34;Sequential&#34; input enforces participants to answer
                  questions in a fixed order, without skipping or returning to
                  previous questions.
                </span>
                <div className="items-center grid grid-cols-2 max-w-sm">
                  <Label htmlFor="airplane-mode">Sequential</Label>
                  <Switch
                    id="airplane-mode"
                    checked={isSequential}
                    onCheckedChange={setIsSequential}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <span className={'text-sm text-muted-foreground'}>
                  The &#34;Shuffle Options&#34; input randomizes the order of
                  choices in multiple-choice questions, reducing the likelihood
                  of patterned guessing.
                </span>
                <div className="items-center grid grid-cols-2 max-w-sm">
                  <Label htmlFor="shuffle-options">Shuffle Options</Label>
                  <Switch
                    id="shuffle-options"
                    checked={shuffleOptions}
                    onCheckedChange={setShuffleOptions}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <span className={'text-sm text-muted-foreground'}>
                  The &#34;Shuffle Questions&#34; input randomizes the order of
                  questions for each participant, ensuring a unique sequence for
                  every individual.
                </span>
                <div className="items-center grid grid-cols-2 max-w-sm">
                  <Label htmlFor="shuffle-questions">Shuffle Questions</Label>
                  <Switch
                    id="shuffle-questions"
                    checked={shuffleQuestions}
                    onCheckedChange={setShuffleQuestions}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={'flex gap-3'}>
          <Button onClick={handleSaveConfig}>
            <Save /> Save Configuration
          </Button>
          <Button variant={'outline'} asChild>
            <Link className={'flex'} href={`/main/exam/simulate/${id}`}>
              <CirclePlay /> Simulate
            </Link>
          </Button>
          <Button variant={'outline'}>
            <RotateCcw /> Reset Configuration
          </Button>
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
