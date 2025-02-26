'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { getBearerHeader } from '@/app/_services/getBearerHeader.service'
import { toast } from 'sonner'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/sonner'
import { Spinner } from '@/components/custom-component/Spinner'

export default function ExamSubmitPage({ params }: any) {
  const examId = params.id
  const [resultFile, setResultFile] = useState<File | undefined>()
  const [resultFileErr, setResultFileErr] = useState('')
  const [examData, setExamData] = useState<any>()
  const [showSubmitSpinner, setShowSubmitSpinner] = useState(false)

  const getExam = async () => {
    try {
      const response = await axios.get(
        `${process.env.API_URL}/exam/${examId}`,
        {
          headers: getBearerHeader(localStorage.getItem('token')!).headers,
        }
      )

      if (response.status === 200) {
        setExamData(response.data.data)
      }
    } catch (e: any) {
      toast.error(e.response.data.message)
    }
  }

  const handleSubmit = async () => {
    if (!resultFile) {
      toast.error('Insert the file first!')
      return
    }

    const formData = new FormData()
    formData.append('exam_id', examId)
    formData.append('result_file', resultFile)

    try {
      const submitData = await axios.post(
        `${process.env.API_URL}/exam/submit`,
        formData
      )
      if (submitData.status === 200) {
        setShowSubmitSpinner(false)
        toast.success(submitData.data.message)
      }
    } catch (e: any) {
      setShowSubmitSpinner(false)
      toast.error(e.response.data.message)
    }
  }

  useEffect(() => {
    getExam().then()
  }, [])

  return (
    <div className={'w-full h-screen flex items-center justify-center'}>
      <div className={'border rounded-lg w-96 py-10 px-5 flex flex-col'}>
        <h3 className={'font-semibold text-2xl text-center'}>
          Submit Exam Result
        </h3>

        <span className={'text-sm mt-3 text-muted-foreground'}>
          This is the submission page for{' '}
          {`${examData?.course.title} - ${examData?.title}`}. You can find the
          configuration file at <br /> <br />{' '}
          <span className={'font-mono'}>Documents/honestest/exam_results</span>.
        </span>

        <div className="grid w-full max-w-sm items-center gap-1.5 mt-5">
          <Label htmlFor="enroll-file">Exam Result File</Label>
          <Input
            type="file"
            id="enroll-file"
            accept=".ta12r"
            onChange={(e: any) => {
              setResultFile(e.target.files![0])
            }}
          />
          <span className={'text-red-500 text-sm'}>{resultFileErr}</span>
        </div>

        <Button
          className={'mt-5'}
          onClick={() => {
            setResultFileErr('')
            setShowSubmitSpinner(true)
            if (resultFile === undefined || resultFile === null) {
              setResultFileErr('Cannot be empty!')
            } else {
              handleSubmit().then()
            }
          }}
        >
          Submit{' '}
          <Spinner
            show={showSubmitSpinner}
            className={'text-primary-foreground'}
          />
        </Button>
      </div>
      <Toaster richColors />
    </div>
  )
}
