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
import Link from 'next/link'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'

export default function ReviewPage({ params }: any) {
  const id = params.id
  const [examResultData, setExamResultData] = useState<any>(null)
  // const userUsername = useSelector(selectUser).username

  // state untuk question
  const [answers, setAnswers] = useState<any[]>([])
  const [exam, setExam] = useState<any>([])

  const getExamResult = async () => {
    const response = await axios.get(
      `${apiUrl}/exam-result/${id}`,
      getBearerHeader(localStorage.getItem('token')!)
    )

    setExamResultData(response.data.data)
    setAnswers(response.data.data.answers)
    setExam(response.data.data.exam)
  }

  useEffect(() => {
    getExamResult().then()
  }, [])

  return (
    <ContentLayout title="Configure Exam">
      <Card id={'card-utama'} className={'w-full p-10 h-[calc(100vh-180px)]'}>
        <h3 className={'font-bold text-xl mb-5'}>
          Result of {exam ? exam.title : ''} {exam?.course_title}
        </h3>

        <div className={'flex gap-5 h-full pb-10'}>
          {/*sebelah kiri*/}
          <div
            className={
              'flex flex-col w-full overflow-y-scroll scroll-smooth border rounded-lg px-5 pb-5'
            }
          >
            {answers.map((answer: any, ansIndex) => (
              <div
                key={ansIndex}
                id={`${ansIndex}`}
                className={'flex gap-3 rounded-lg p-5 pb-0 mr-5'}
              >
                <div>{ansIndex + 1}.</div>
                <div className={'w-full h-auto'}>
                  {parse(answer.question.content)}
                  {answer.question.type === 'essay' ? (
                    <div className={'mt-3'}>
                      <span className={'font-bold'}>Your answer :</span>

                      <div className={'border w-full rounded-lg p-2 mt-1'}>
                        {parse(answer.answer ? answer.answer : '')}
                      </div>
                    </div>
                  ) : (
                    <RadioGroup
                      value={answer.answer}
                      className={'flex ms-5 flex-col mt-2'}
                    >
                      {answer.question.options.map(
                        (option: any, optionIndex: number) => (
                          <div
                            key={optionIndex}
                            className={'flex items-center gap-3'}
                          >
                            <div>
                              {answer.question.type === 'multiple' ? (
                                <div className={'flex items-center gap-3'}>
                                  <RadioGroupItem value={option.id} />
                                  {String.fromCharCode(97 + optionIndex)}.
                                </div>
                              ) : (
                                ''
                              )}

                              {answer.question.type === 'check-box' ? (
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`${option.id}`}
                                    checked={(answer.answer || []).includes(
                                      option.id
                                    )}
                                  />
                                </div>
                              ) : (
                                ''
                              )}
                            </div>
                            <div
                              className={option.isCorrect ? 'bg-green-300' : ''}
                            >
                              {answer.question.type === 'multiple' ? (
                                <div>{parse(option.option)}</div>
                              ) : (
                                ''
                              )}

                              {answer.question.type === 'check-box' ? (
                                <label
                                  htmlFor={`${option.id}`}
                                  className={`peer-disabled:cursor-not-allowed peer-disabled:opacity-70`}
                                >
                                  {parse(option.option)}
                                </label>
                              ) : (
                                ''
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </RadioGroup>
                  )}

                  <div className={'mt-2 text-muted-foreground'}>
                    Point : {answer.score} of {answer.question.point}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/*sebelah kanan*/}
          <div className={'max-w-xs w-full flex flex-col gap-5'}>
            <div className={'border rounded-lg p-5 flex flex-col'}>
              <span className={'font-bold mb-5'}>Question List</span>

              <div className={'grid grid-cols-5 gap-2'}>
                {answers.map((answer: any, index: number) => (
                  <Link
                    href={`#${index}`}
                    key={index}
                    className={
                      'border rounded-lg flex justify-center flex-col items-center'
                    }
                  >
                    <span className={'my-2'}>{index + 1}</span>
                    <div
                      className={`w-full h-6 rounded-b-lg ${answer.answer ? 'bg-muted-foreground' : 'bg-muted'}`}
                    ></div>
                  </Link>
                ))}
              </div>
            </div>

            <div className={'border rounded-lg w-full flex flex-col p-5'}>
              <span className={'font-bold'}>Grade</span>

              <div className={'mt-3 text-center w-full text-3xl'}>
                {(
                  (examResultData?.total_score /
                    examResultData?.expected_score) *
                  100
                ).toFixed(2)}{' '}
                / 100.00
              </div>
            </div>

            <div className={'border rounded-lg w-full flex flex-col p-5'}>
              <span className={'font-bold'}>Status</span>

              {(examResultData?.total_score / examResultData?.expected_score) *
                100 >=
              exam?.passing_grade ? (
                <div
                  className={
                    'mt-3 text-center w-full text-3xl text-green-500 font-bold'
                  }
                >
                  Passed
                </div>
              ) : (
                <div
                  className={
                    'mt-3 text-center w-full text-3xl text-red-400 font-bold'
                  }
                >
                  Not Pass
                </div>
              )}

              <div className={'text-center text-muted-foreground mt-2'}>
                Passing Grade : {exam?.passing_grade}
              </div>
            </div>

            <div className={'flex gap-3'}>
              <Button>
                <Link href={`/main/exam/simulate/${exam.id}`}>
                  Finish Review
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </ContentLayout>
  )
}
