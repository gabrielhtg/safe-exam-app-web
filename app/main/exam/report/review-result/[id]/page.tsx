'use client'

import React, { useEffect, useState } from 'react'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import { Card } from '@/components/ui/card'
import axios from 'axios'
import { getBearerHeader } from '@/app/_services/getBearerHeader.service'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import parse from 'html-react-parser'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'

export default function ReviewResult({ params }: any) {
  const examResultId = params.id
  const [examResultData, setExamResultData] = useState<any>(null)
  const [essayAnswers, setEssayAnswers] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.API_URL}/exam-result/${examResultId}`,
          getBearerHeader(localStorage.getItem('token')!)
        )
        setExamResultData(data.data)
      } catch (e: any) {
        toast.error(e.response?.data?.message || 'Failed to fetch data')
      }
    }
    fetchData()
  }, [examResultId])

  useEffect(() => {
    if (examResultData) {
      const fetchEssayAnswers = async () => {
        try {
          const { data } = await axios.get(
            `${process.env.API_URL}/exam/${examResultId}/review-result`,
            getBearerHeader(localStorage.getItem('token')!)
          )
          setEssayAnswers(data.data)
        } catch (e: any) {
          toast.error(
            e.response?.data?.message || 'Failed to fetch essay answers'
          )
        }
      }
      fetchEssayAnswers()
    }
  }, [examResultData])

  return (
    <ContentLayout title="review-result">
      <Button onClick={() => router.back()}>
        <ArrowLeft /> Back
      </Button>
      <Card
        id={'card-utama'}
        className={'w-full p-10 mt-5 flex flex-col min-h-[calc(100vh-180px)]'}
      >
        <span className={'font-bold text-xl mb-5'}>
          Result of {examResultData ? examResultData.title : ''}{' '}
          {examResultData?.course_title}
        </span>

        <div className={'flex gap-5 h-full pb-10 mt-5'}>
          {/* Sebelah kiri (konten utama) */}
          <div
            className={
              'flex flex-col w-full overflow-y-scroll scroll-smooth border rounded-lg px-5 pb-5'
            }
          >
            {essayAnswers.map((answer: any, ansIndex) => (
              <div
                key={ansIndex}
                className={'flex gap-3 rounded-lg p-5 pb-0 mr-5'}
              >
                <div>
                  {ansIndex + 1}.{' '}
                  <span className={'font-bold'}>{answer.id}</span>
                </div>
                <div className={'w-full h-auto'}>
                  {parse(answer.question.content)}
                  {answer.question.type === 'essay' ? (
                    <div className={'mt-3'}>
                      <span className={'font-bold'}>Your answer :</span>
                      <div className={'border w-full rounded-lg p-2 mt-1'}>
                        {parse(answer.answer ? answer.answer : 'Not Answered')}
                      </div>
                    </div>
                  ) : (
                    <RadioGroup
                      value={answer.answer}
                      className={'flex ms-5 flex-col mt-2'}
                    >
                      {answer.question.options.map(
                        (option: any, optionIndex: number) => {
                          const isSelected =
                            answer.question.type === 'multiple'
                              ? answer.answer === option.id
                              : answer.question.type === 'check-box'
                                ? (answer.answer || []).includes(option.id)
                                : false
                          const optionClass = isSelected
                            ? option.isCorrect
                              ? 'bg-green-300'
                              : 'bg-red-300'
                            : ''
                          return (
                            <div
                              key={optionIndex}
                              className="flex items-center gap-3"
                            >
                              <div>
                                {answer.question.type === 'multiple' && (
                                  <div className="flex items-center gap-3">
                                    <RadioGroupItem value={option.id} />
                                    {String.fromCharCode(97 + optionIndex)}.
                                  </div>
                                )}
                                {answer.question.type === 'check-box' && (
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`${option.id}`}
                                      checked={(answer.answer || []).includes(
                                        option.id
                                      )}
                                    />
                                  </div>
                                )}
                              </div>
                              <div className={optionClass + ' p-1 rounded'}>
                                {answer.question.type === 'multiple' && (
                                  <div>{parse(option.option)}</div>
                                )}
                                {answer.question.type === 'check-box' && (
                                  <label
                                    htmlFor={`${option.id}`}
                                    className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                  >
                                    {parse(option.option)}
                                  </label>
                                )}
                              </div>
                            </div>
                          )
                        }
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

          {/* Sebelah kanan (footer atau informasi lainnya) */}
          <div className={'max-w-xs w-full flex flex-col gap-5'}>
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
          </div>
        </div>
      </Card>
    </ContentLayout>
  )
}
