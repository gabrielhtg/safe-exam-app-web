'use client'

import { Card } from '@/components/ui/card'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import React, { useEffect, useState } from 'react'
import { useQuill } from 'react-quilljs'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

import 'quill/dist/quill.snow.css'
import Quill from 'quill'
import QuillResizeImage from 'quill-resize-image'
import { Input } from '@/components/ui/input' // Add css for snow theme

Quill.register('modules/resize', QuillResizeImage)

export default function ExamQuestionPage({ params }: any) {
  const id = params.id
  const getAllQuestions = async () => {}

  const theme = 'snow'

  const modules = {
    resize: {
      locale: {},
    },
  }

  const placeholder = 'Compose an epic...'

  const { quill, quillRef } = useQuill({
    theme: theme,
    placeholder: placeholder,
    modules: modules,
  })

  const [questions, setQuestions] = useState([])

  useEffect(() => {
    getAllQuestions().then()
  }, [])

  return (
    <ContentLayout title="Exam">
      <Card
        id={'card-utama'}
        className={'w-full p-10 min-h-[calc(100vh-180px)]'}
      >
        <h3 className={'font-bold mb-5'}>Question List</h3>

        <div className="w-full max-w-sm items-center flex gap-3 mb-7">
          <Label htmlFor="score">Score</Label>
          <Input type="number" id="score" placeholder="100" />
        </div>

        <div className={'flex gap-3'}>
          <div>1.</div>
          <div className={'w-full h-auto'}>
            <div ref={quillRef} className={'rounded-b-lg'} />
          </div>

          <div className={'border rounded-lg p-3 flex flex-col w-52 gap-3'}>
            <span className={'font-bold'}>Question Type</span>

            <div>
              <RadioGroup defaultValue="multiple">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="multiple"
                    id="multiple"
                    aria-selected={true}
                  />
                  <Label htmlFor="multiple">Multiple Choice</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="essay" id="essay" />
                  <Label htmlFor="essay">Essay</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="check-box" id="check-box" />
                  <Label htmlFor="check-box">Check Box</Label>
                </div>
              </RadioGroup>
            </div>

            <span className={'font-bold'}>Remarks</span>

            <Input type={'number'} placeholder={'0'} />
          </div>
        </div>
      </Card>
    </ContentLayout>
  )
}
