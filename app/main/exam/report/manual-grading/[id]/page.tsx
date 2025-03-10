'use client'

import React, { useEffect, useState } from 'react'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import axios from 'axios'
import { getBearerHeader } from '@/app/_services/getBearerHeader.service'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import parse from 'html-react-parser'

export default function ProctoringLog({ params }: any) {
  const examResultId = params.id
  const [essayAnswers, setEssayAnswers] = useState<any[]>([])
  const [grades, setGrades] = useState<Record<number, string>>({})
  const router = useRouter()
  const [examResultData, setExamResultData] = useState([])
  const examId = params.id
  const [submittedAnswers, setSubmittedAnswers] = useState<number[]>([])

  const getExamResult = async () => {
    try {
      const response = await axios.get(`${process.env.API_URL}/exam-result`, {
        headers: getBearerHeader(localStorage.getItem('token')!).headers,
        params: {
          exam: examId,
        },
      })

      if (response.status == 200) {
        setExamResultData(response.data.data)
      }
    } catch (e: any) {
      toast.error(e.response.message)
    }
  }

  const updateGradingStatus = async () => {
    // Pastikan semua soal telah di-submit
    const allSubmitted = essayAnswers.every(answer => submittedAnswers.includes(answer.id))
  
    if (!allSubmitted) {
      toast.error('You must submit grades for all questions before saving.')
      return
    }
  
    try {
      await axios.patch(
        `${process.env.API_URL}/exam-result/${examResultId}/update-graded`,
        { graded: true },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      toast.success('Grading status updated successfully')
    } catch (e: any) {
      toast.error(`Failed to update grading status. ${e.response?.data?.message || 'Unknown error'}`)
    }
  }
    
  useEffect(() => {
    const fetchEssayAnswers = async () => {
      try {
        const essayRes = await axios.get(
          `${process.env.API_URL}/exam/${examResultId}/essayAnswer`,
          getBearerHeader(localStorage.getItem('token')!)
        )
        setEssayAnswers(essayRes.data.data)
      } catch (e: any) {
        toast.error(
          e.response?.data?.message || 'Failed to fetch essay answers'
        )
      }
    }

    fetchEssayAnswers().then()
    getExamResult().then()
  }, [examResultId])

  const handleInputChange = (answerId: number, value: string) => {
    if (!/^[0-9]*\.?[0-9]*$/.test(value)) return

    setGrades((prev) => ({
      ...prev,
      [answerId]: value,
    }))
  }

  const submitGrade = async (answerId: number) => {
  const scoreStr = grades[answerId]
  if (!scoreStr) return toast.error('Score is required')

  const score = parseFloat(scoreStr)
  if (isNaN(score)) return toast.error('Invalid score')

  const answer = essayAnswers.find((ans) => ans.id === answerId)
  if (!answer) {
    toast.error("Answer not found")
    return
  }

  if (!answer.result || answer.result.expected_score === undefined) {
    toast.error("Expected score is missing")
    return
  }

  const expectedScore = answer.result.expected_score
  if (score > expectedScore) {
    toast.error("Failed to submit, cannot be bigger than expected points")
    return
  }

  try {
    await axios.patch(
      `${process.env.API_URL}/exam-result/${answerId}/grade`,
      { score },
      getBearerHeader(localStorage.getItem('token')!)
    )

    toast.success('Grade submitted successfully')

    // Tambahkan ID jawaban yang telah di-submit
    setSubmittedAnswers((prev) => [...prev, answerId])

    // Langsung update nilai di UI
    setEssayAnswers((prevAnswers) =>
      prevAnswers.map((answer) =>
        answer.id === answerId ? { ...answer, score } : answer
      )
    )

    // Reset input setelah submit
    setGrades((prev) => ({
      ...prev,
      [answerId]: '',
    }))
  } catch (e: any) {
    toast.error(e.response?.data?.message || 'Failed to submit grade')
  }
}

  return (
    <ContentLayout title="Exam">
      <Card className="w-full p-10 min-h-[calc(100vh-180px)]">
        <h3 className="font-bold mb-5 text-3xl">Manual Check</h3>
        <Button onClick={() => router.back()}>
          <ArrowLeft /> Back
        </Button>

        {essayAnswers.length > 0 ? (
          <div className="border rounded-lg mt-4 p-6">
            <div className="space-y-6">
              {essayAnswers.map((answer) => (
                <div key={answer.id} className="w-full h-auto">
                  <div className="font-bold">Question:</div>
                  <div>{parse(answer.question.content)}</div>

                  <div className="mt-3">
                    <span className="font-bold">Answer:</span>
                    <div className="border w-full rounded-lg p-2 mt-1">
                      {parse(answer.answer || 'Not Answered')}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    <input
                      type="text"
                      className="border p-2 rounded w-20 text-right"
                      placeholder="0"
                      value={grades[answer.id] || ''}
                      onChange={(e) =>
                        handleInputChange(answer.id, e.target.value)
                      }
                    />
                    <div className="text-muted-foreground">
                      out of {answer.question.point}
                    </div>
                    <Button
                      type="button"
                      onClick={() => submitGrade(answer.id)}
                    >
                      Submit
                    </Button>
                  </div>

                  <div className="w-[85px] flex flex-col gap-5">
                    <div className="w-[85px] border rounded-lg flex flex-col p-5 mt-3">
                      <p className="font-bold">Score</p>
                      <div className="mt-3 text-center w-full text-2xl">
                        {answer.score ?? '-'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center mt-5">No essay answers found.</p>
        )}
        <Button className='mt-5' onClick={() => updateGradingStatus()}>
          <ArrowLeft /> Save
        </Button>
      </Card>
    </ContentLayout>
  )
}
