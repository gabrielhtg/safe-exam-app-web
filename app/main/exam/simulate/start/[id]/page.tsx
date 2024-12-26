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
import dynamic from 'next/dynamic'
import parse from 'html-react-parser'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import Link from 'next/link'
import CountdownTimer from '@/components/custom-component/CountDown'
import _ from 'lodash'
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

export default function ExamSimulationStart({ params }: any) {
  const id = params.id
  const [examData, setExamData] = useState<any>(null)
  const [dialogMsg, setDialogMsg] = useState('')
  const [showDialog, setShowDialog] = useState(false)
  const [dialogType, setDialogType] = useState(1)
  const [editorConfig, setEditorConfig] = useState<any>(null)

  // state untuk exam behaviour
  const [hoursLimit, setHoursLimit] = useState<number>()
  const [minutesLimit, setMinutesLimit] = useState<number>()
  const [secondsLimit, setSecondsLimit] = useState<number>()

  // state untuk question behaviour
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: string
  }>({})

  // state untuk question
  const [questions, setQuestions] = useState<any[]>([])

  const handleValueChange = (questionIndex: number, value: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: value,
    }))

    console.log(selectedAnswers)
  }

  const handleClearOption = (questionIndex: number) => {
    setSelectedAnswers((prev) => {
      const updatedAnswers = { ...prev }
      delete updatedAnswers[questionIndex]
      return updatedAnswers
    })
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

  const getExamData = async () => {
    const response = await axios.get(
      `${apiUrl}/exam/${id}`,
      getBearerHeader(localStorage.getItem('token')!)
    )

    setExamData(response.data.data)

    getAllQuestions(
      response.data.data.shuffle_questions,
      response.data.data.shuffle_options
    ).then()

    setHoursLimit(Math.floor(response.data.data.time_limit / 3600))
    setMinutesLimit(Math.floor((response.data.data.time_limit % 3600) / 60))
    setSecondsLimit(Math.floor((response.data.data.time_limit % 3600) % 60))
  }

  const getAllQuestions = async (
    shuffledQuestions: boolean,
    shuffledOptions: boolean
  ) => {
    try {
      const response = await axios.get(
        `${apiUrl}/question${shuffledOptions ? '/shuffled' : ''}`,
        {
          params: {
            exam: id,
          },
          headers: getBearerHeader(localStorage.getItem('token')!).headers,
        }
      )

      if (shuffledQuestions) {
        setQuestions(_.shuffle(response.data.data))
      } else {
        setQuestions(response.data.data)
      }
    } catch (err: any) {
      console.log(err)
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
      <Card id={'card-utama'} className={'w-full p-10 h-[calc(100vh-180px)]'}>
        <h3 className={'font-bold text-xl mb-5'}>
          {examData ? examData.title : ''} {examData?.course_title}
        </h3>

        <div className={'flex gap-5 h-full pb-10'}>
          {/*sebelah kiri*/}
          <div
            className={
              'flex flex-col w-full overflow-y-scroll scroll-smooth border rounded-lg px-5 pb-5'
            }
          >
            {questions.map((e: any, questionIndex) => (
              <div
                key={questionIndex}
                id={`${questionIndex}`}
                className={'flex gap-3 rounded-lg p-5 pb-0 mr-5'}
              >
                <div>{questionIndex + 1}.</div>
                <div className={'w-full h-auto'}>
                  {parse(e.content)}
                  <RadioGroup
                    value={selectedAnswers[questionIndex] || ''}
                    onValueChange={(value) =>
                      handleValueChange(questionIndex, value)
                    }
                    className={'flex ms-5 flex-col mt-2'}
                  >
                    {e.options.map((item: any, optionIndex: number) => (
                      <div
                        key={optionIndex}
                        className={'flex items-center gap-3'}
                      >
                        <div>
                          {e.type === 'multiple' ? (
                            <div className={'flex items-center gap-3'}>
                              <RadioGroupItem value={item.id} />
                              {String.fromCharCode(97 + optionIndex)}.
                            </div>
                          ) : (
                            ''
                          )}

                          {e.type === 'check-box' ? (
                            <div className="flex items-center space-x-2">
                              <Checkbox disabled={true} id={`${optionIndex}`} />
                            </div>
                          ) : (
                            ''
                          )}
                        </div>
                        <div>
                          {e.type === 'multiple' ? (
                            <>{parse(item.option)}</>
                          ) : (
                            ''
                          )}

                          {e.type === 'check-box' ? (
                            <label
                              htmlFor={`${optionIndex}`}
                              className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {parse(item.option)}
                            </label>
                          ) : (
                            ''
                          )}
                        </div>
                      </div>
                    ))}

                    {selectedAnswers[questionIndex] ? (
                      <div>
                        <Button
                          variant={'secondary'}
                          onClick={() => {
                            handleClearOption(questionIndex)
                          }}
                        >
                          Clear Option
                        </Button>
                      </div>
                    ) : (
                      ''
                    )}
                  </RadioGroup>
                </div>
              </div>
            ))}
          </div>

          {/*sebelah kanan*/}
          <div className={'max-w-xs w-full flex flex-col gap-5'}>
            <div className={'border rounded-lg p-5 flex flex-col'}>
              <span className={'font-bold mb-5'}>Question List</span>

              <div className={'grid grid-cols-5 gap-2'}>
                {questions.map((e: any, index: number) => (
                  <Link
                    href={`#${index}`}
                    key={index}
                    className={
                      'border rounded-lg flex justify-center flex-col items-center'
                    }
                  >
                    <span className={'my-2'}>{index + 1}</span>
                    <div
                      className={`w-full h-6 rounded-b-lg ${selectedAnswers[index] ? 'bg-muted-foreground' : 'bg-muted'}`}
                    ></div>
                  </Link>
                ))}
              </div>
            </div>

            {hoursLimit ? (
              <CountdownTimer
                hours={hoursLimit}
                minutes={minutesLimit}
                seconds={secondsLimit}
              />
            ) : (
              ''
            )}
            <div>
              <Button>Submit Answer</Button>
            </div>
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
