'use client'

import { Card } from '@/components/ui/card'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import React, { useEffect, useState } from 'react'
import 'react-quill/dist/quill.snow.css'
import { getBearerHeader } from '@/app/_services/getBearerHeader.service'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import dynamic from 'next/dynamic'
import parse from 'html-react-parser'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import Link from 'next/link'
import CountdownTimer from '@/components/custom-component/CountDown'
import _ from 'lodash'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { selectUser } from '@/lib/_slices/userSlice'
import { RefreshCw, Send } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toast } from 'sonner'
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

export default function ExamSimulationStart({ params }: any) {
  const id = params.id
  const [examData, setExamData] = useState<any>(null)
  const userUsername = useSelector(selectUser).username
  const [editorConfig, setEditorConfig] = useState<any>(null)
  const router = useRouter()
  const [submitState, setSubmitState] = useState(1)
  // const [selectedQuestion, setSelectedQuestion] = useState<any>()

  // state untuk exam behaviour
  const [hoursLimit, setHoursLimit] = useState<number>()
  const [minutesLimit, setMinutesLimit] = useState<number>()
  const [secondsLimit, setSecondsLimit] = useState<number>()

  // state untuk question behaviour
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: any
  }>({})

  // state untuk question
  const [questions, setQuestions] = useState<any[]>([])

  const handleValueChange = (questionId: number, value: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const getExamData = async () => {
    const response = await axios.get(
      `${process.env.API_URL}/exam/${id}`,
      getBearerHeader(localStorage.getItem('token')!)
    )

    setExamData(response.data.data)

    getAllQuestions(response.data.data.shuffle_questions).then()

    setHoursLimit(Math.floor(response.data.data.time_limit / 3600))
    setMinutesLimit(Math.floor((response.data.data.time_limit % 3600) / 60))
    setSecondsLimit(Math.floor((response.data.data.time_limit % 3600) % 60))
  }

  const getAllQuestions = async (shuffledQuestions: boolean) => {
    try {
      const response = await axios.get(`${process.env.API_URL}/question`, {
        params: {
          exam: id,
        },

        headers: getBearerHeader(localStorage.getItem('token')!).headers,
      })

      if (shuffledQuestions) {
        setQuestions(_.shuffle(response.data.data))
      } else {
        setQuestions(response.data.data)
      }
    } catch (err: any) {
      toast.error(err.response.data.message)
    }
  }

  const handleSubmitExam = async () => {
    try {
      const submitData = await axios.post(
        `${process.env.API_URL}/exam/submit`,
        {
          username: userUsername,
          exam: examData,
          answer: selectedAnswers,
          questions: questions,
        },
        getBearerHeader(localStorage.getItem('token')!)
      )

      if (examData.enable_review) {
        if (submitData.status === 200) {
          router.push(`/main/exam/simulate/review/${submitData.data.data.id}`)
        }
      } else {
        if (submitData.status === 200) {
          router.push(`/main/exam/simulate/${id}`)
        }
      }
    } catch (e: any) {
      toast.error(e.response.data.message)
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
        className={'w-full p-10 h-[calc(100vh-180px)] overflow-auto'}
      >
        <h3 className={'font-bold text-xl mb-5'}>
          {examData ? examData.title : ''} {examData?.course_title}
        </h3>

        <div className={'flex gap-5 h-[calc(100%-80px)]'}>
          {/*sebelah kiri*/}
          {submitState === 1 ? (
            <div
              className={
                'flex flex-col w-full min-h-[350px] overflow-y-auto scroll-smooth border rounded-lg px-5 pb-5'
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
                    {e.type === 'essay' ? (
                      <>
                        {editorConfig ? (
                          <ReactQuill
                            theme="snow"
                            className={'mt-3'}
                            // value={selectedAnswers[e.id]}
                            onChange={(quillVal) => {
                              setSelectedAnswers((prev) => ({
                                ...prev,
                                [e.id]:
                                  quillVal === '' || quillVal === '<p><br></p>'
                                    ? ''
                                    : quillVal,
                              }))
                            }}
                            modules={editorConfig.modules}
                            formats={editorConfig.formats}
                          />
                        ) : (
                          ''
                        )}
                      </>
                    ) : (
                      <RadioGroup
                        value={selectedAnswers[e.id] || ''}
                        onValueChange={(value) =>
                          handleValueChange(e.id, value)
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
                                  <Checkbox
                                    id={`${item.id}`}
                                    checked={(
                                      selectedAnswers[e.id] || []
                                    ).includes(item.id)}
                                    onCheckedChange={(elm: boolean) =>
                                      setSelectedAnswers((prev: any) => {
                                        const currentAnswers = prev[e.id] || []

                                        if (elm) {
                                          // ini ketika nanti user mencoba untuk memilih semua opsi
                                          // dibatasi bahwa yang bisa dipilih hanya sebesar banyak pilihan yang memungkinkan.
                                          if (
                                            currentAnswers.length >=
                                            e.options.filter(
                                              (tmp: any) => tmp.isCorrect
                                            ).length
                                          ) {
                                            return prev
                                          }

                                          return {
                                            ...prev,
                                            [e.id]: [
                                              ...currentAnswers,
                                              item.id,
                                            ],
                                          }
                                        } else {
                                          if (prev[e.id].length === 1) {
                                            const updatedAns = { ...prev }
                                            delete updatedAns[e.id]
                                            return updatedAns
                                          } else {
                                            return {
                                              ...prev,
                                              [e.id]: currentAnswers.filter(
                                                (id: any) => id !== item.id
                                              ),
                                            }
                                          }
                                        }
                                      })
                                    }
                                  />
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
                                  htmlFor={`${item.id}`}
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

                        {selectedAnswers[e.id] && e.type == 'multiple' ? (
                          <div>
                            <Button
                              variant={'secondary'}
                              onClick={() => {
                                setSelectedAnswers((prev) => {
                                  const updatedAnswers = { ...prev }
                                  delete updatedAnswers[e.id]
                                  return updatedAnswers
                                })
                              }}
                            >
                              Clear Option
                            </Button>
                          </div>
                        ) : (
                          ''
                        )}
                      </RadioGroup>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            ''
          )}

          {submitState === 2 ? (
            <div
              className={
                'flex flex-col w-full overflow-y-scroll scroll-smooth border rounded-lg px-5 pb-5 justify-center items-center'
              }
            >
              <div className={'w-full max-w-xl border rounded-lg'}>
                <Table>
                  <TableHeader>
                    <TableRow className={'divide-x'}>
                      <TableHead className={'text-center'}>
                        Question Number
                      </TableHead>
                      <TableHead className={'text-center'}>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {questions.map((question, index) => (
                      <TableRow key={index} className={'divide-x'}>
                        <TableCell className={'text-center'}>
                          {index + 1}
                        </TableCell>
                        <TableCell className={'text-center'}>
                          {selectedAnswers[question.id] ? (
                            <span className={'text-green-500 font-bold'}>
                              Answered
                            </span>
                          ) : (
                            <span className={'text-red-500'}>Not Answered</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <Button
                className={'mt-5'}
                onClick={() => {
                  setSubmitState(1)
                }}
              >
                Back To Question
              </Button>
            </div>
          ) : (
            ''
          )}

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
                      className={`w-full h-6 rounded-b-lg ${selectedAnswers[e.id] ? 'bg-muted-foreground' : 'bg-muted'}`}
                    ></div>
                  </Link>
                ))}
              </div>
            </div>

            {hoursLimit || minutesLimit || secondsLimit ? (
              <CountdownTimer
                hours={hoursLimit}
                minutes={minutesLimit}
                seconds={secondsLimit}
                onTimeUp={handleSubmitExam}
              />
            ) : (
              ''
            )}

            <div className={'flex gap-3'}>
              <div>
                {submitState !== 2 ? (
                  <Button
                    onClick={() => {
                      if (submitState === 2) {
                        handleSubmitExam().then()
                      } else {
                        setSubmitState(submitState + 1)
                      }
                    }}
                  >
                    <Send />
                    {submitState === 1 ? 'Submit' : ''}
                  </Button>
                ) : null}
              </div>

              <div>
                <Button
                  onClick={() => {
                    router.push(`/main/exam/question/${id}`)
                  }}
                >
                  <RefreshCw />
                  Update Question
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </ContentLayout>
  )
}
