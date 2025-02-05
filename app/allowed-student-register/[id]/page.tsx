'use client'

import React, { useEffect, useState } from 'react'
import { Toaster } from '@/components/ui/sonner'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import axios from 'axios'
import { apiUrl } from '@/lib/env'
import { getBearerHeader } from '@/app/_services/getBearerHeader.service'

export default function AllowedUserRegisterPage({ params }: any) {
  const courseId = params.id
  const [enrollKey, setEnrollKey] = useState('')
  const [enrollFile, setEnrollFile] = useState<File | undefined>()
  const [enrollKeyErr, setEnrollKeyErr] = useState('')
  const [courseData, setCourseData] = useState<any>()

  const getCourse = async () => {
    try {
      const response = await axios.get(`${apiUrl}/course/${courseId}`, {
        headers: getBearerHeader(localStorage.getItem('token')!).headers,
      })

      setCourseData(response.data.data)
    } catch (e: any) {
      console.log(e)
    }
  }

  const handleEnroll = async () => {
    if (!enrollFile) {
      toast.error('Enter the credential file first!')
      return
    }

    const reader = new FileReader()
    let tempCredential = null

    reader.onload = async (event) => {
      const fileContent = event.target?.result
      if (typeof fileContent === 'string') {
        tempCredential = JSON.parse(fileContent)
        tempCredential = {
          ...tempCredential,
          course_id: courseId,
          enroll_key: enrollKey,
        }

        try {
          const response = await axios.post(
            `${apiUrl}/allowed-student`,
            tempCredential,
            getBearerHeader(localStorage.getItem('token')!)
          )

          toast.success(response.data.message)
        } catch (e: any) {
          toast.error(e.response.data.message)
        }
      }
    }

    reader.onerror = () => {
      toast.error('Error reading file')
    }

    reader.readAsText(enrollFile)
  }

  useEffect(() => {
    getCourse().then()
  }, [])

  return (
    <div className={'w-full h-screen flex items-center justify-center'}>
      <div className={'border rounded-lg w-96 py-10 px-5 gap-5 flex flex-col'}>
        <h3 className={'font-semibold text-2xl text-center'}>
          Enroll to {courseData?.title} Course
        </h3>

        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="enroll-key">Enroll Key</Label>
          <Input
            type="password"
            id="enroll-key"
            placeholder={'Enroll Key'}
            value={enrollKey}
            onChange={(e: any) => {
              setEnrollKeyErr('')
              setEnrollKey(e.target.value)
            }}
          />
          <span className={'text-sm text-red-500'}>{enrollKeyErr}</span>
        </div>

        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="enroll-file">Enroll File</Label>
          <Input
            type="file"
            id="enroll-file"
            accept=".ta12c"
            onChange={(e: any) => {
              setEnrollFile(e.target.files![0])
            }}
          />
        </div>

        <Button
          onClick={() => {
            setEnrollKeyErr('')
            if (enrollKey === '') {
              setEnrollKeyErr('Cannot be empty!')
            } else {
              handleEnroll().then()
            }
          }}
        >
          Enroll Now
        </Button>
      </div>
      <Toaster richColors />
    </div>
  )
}
