'use client'

import React, { useEffect, useState } from 'react'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import { Card } from '@/components/ui/card'
import axios from 'axios'
import { apiUrl } from '@/lib/env'
import { getBearerHeader } from '@/app/_services/getBearerHeader.service'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import parse from 'html-react-parser'

export default function ProctoringLog({ params }: any) {
  const examResultId = params.id
  const [essayAnswers, setEssayAnswers] = useState<any[]>([])
  const [grades, setGrades] = useState<
    Record<number, { score: number; isCorrect: boolean }>
  >({})
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/exam-result/${examResultId}`,
          getBearerHeader(localStorage.getItem('token')!)
        )

        if (response.status === 200) {
          fetchEssayAnswers().then()
        }
      } catch (e: any) {
        toast.error(e.response?.data?.message || 'Failed to fetch data')
      }
    }

    fetchData().then()
  }, [examResultId])

  const fetchEssayAnswers = async () => {
    try {
      const essayRes = await axios.get(
        `${apiUrl}/exam/${examResultId}/essayAnswer`,
        getBearerHeader(localStorage.getItem('token')!)
      )
      setEssayAnswers(essayRes.data.data)
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed to fetch essay answers')
    }
  }

  const handleInputChange = (
    answerId: number,
    field: 'score' | 'isCorrect',
    value: any
  ) => {
    setGrades((prev) => ({
      ...prev,
      [answerId]: { ...prev[answerId], [field]: value },
    }))
  }

  const submitGrade = async (answerId: number) => {
    const { score, isCorrect } = grades[answerId] || {}
    if (score === undefined) return toast.error('Score is required')

    try {
      await axios.patch(
        `${apiUrl}/exam-result/${answerId}/grade`,
        { score, isCorrect },
        getBearerHeader(localStorage.getItem('token')!)
      )
      toast.success('Grade submitted successfully')
      fetchEssayAnswers()
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
          <div className="border rounded-lg mt-2 p-5">
            <h4 className="font-bold">Essay Answers</h4>
            {essayAnswers.map((answer) => (
              <div key={answer.id} className="border p-4 mt-3 rounded-lg">
                <h5 className="font-semibold">Question:</h5>
                <p>{parse(answer.question.content)}</p>

                <h5 className="mt-3 font-semibold">Answer:</h5>
                <p>{answer.answer?.text || 'No answer given'}</p>

                <div className="mt-3 flex items-center gap-2">
                  <Input
                    type="number"
                    value={grades[answer.id]?.score ?? ''}
                    step="0.1"
                    min="0"
                    onChange={(e) =>
                      handleInputChange(
                        answer.id,
                        'score',
                        Number(e.target.value)
                      )
                    }
                    placeholder="Enter Score"
                    className="w-30 h-11 text-sm px-2"
                  />
                  <p className="text-sm text-muted-foreground">
                    out of {answer.question.point}
                  </p>
                  <Button
                    onClick={() => submitGrade(answer.id)}
                    className="w-30 ml-3 h-12 px-3 text-sm"
                  >
                    Submit Grade
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center mt-5">No essay answers found.</p>
        )}
      </Card>
    </ContentLayout>
  )
}
