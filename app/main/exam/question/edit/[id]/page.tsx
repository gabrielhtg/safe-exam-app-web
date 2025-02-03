'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Save } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Input } from '@/components/ui/input'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { apiUrl } from '@/lib/env'
import axios from 'axios'
import { toast } from 'sonner'
import 'react-quill/dist/quill.snow.css'
import { getBearerHeader } from '@/app/_services/getBearerHeader.service'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

export default function EditQuestionPage({ params }: any) {
  const questionId = params.id
  const router = useRouter()
  const [editorConfig, setEditorConfig] = useState<any>(null)
  const [remarks, setRemarks] = useState<number>(1)
  const [questionType, setQuestionType] = useState('multiple')
  const [questionData, setQuestionData] = useState<any>()

  const getExamData = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/question/${questionId}`,
        getBearerHeader(localStorage.getItem('token')!)
      )
      setQuestionData(response.data.data)
    } catch (e: any) {
      toast.error(`Failed to fetch question data. ${e.response.message}`)
    }
  }

  const handleSaveQuestion = async () => {
    try {
      const response = await axios.patch(
        `${apiUrl}/question/${questionId}`,
        questionData,
        getBearerHeader(localStorage.getItem('token')!)
      )

      if (response.status === 200) {
        router.back()
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
    <ContentLayout title="Exam Question">
      <Card
        id={'card-utama'}
        className={'w-full p-10 min-h-[calc(100vh-180px)]'}
      >
        <h3 className={'font-bold text-xl mb-5'}>Edit Question</h3>

        <div className={'flex gap-2 mb-3'}>
          <Button
            onClick={() => {
              handleSaveQuestion().then()
            }}
          >
            <Save />
            Save
          </Button>

          <Button
            onClick={() => {
              router.back()
            }}
          >
            <ArrowLeft /> Back
          </Button>
        </div>

        <div className={'flex flex-col gap-5'}>
          <div className={'flex gap-3 border rounded-lg p-5 '}>
            <div className={'w-full'}>
              {editorConfig ? (
                <div className={'flex gap-3 w-full'}>
                  <div className={'w-full'}>
                    <ReactQuill
                      theme="snow"
                      value={questionData?.content}
                      onChange={(e: any) => {
                        setQuestionData((prev: any) => ({
                          ...prev,
                          content: e,
                        }))
                      }}
                      modules={editorConfig.modules}
                      formats={editorConfig.formats}
                    />

                    {questionData?.options.length > 0 ? (
                      <div className={'flex ms-5 flex-col mt-5 gap-3'}>
                        {questionData?.options.map(
                          (item: any, index: number) => (
                            <div
                              key={index}
                              className={'flex items-center gap-3'}
                            >
                              <div>
                                {questionType === 'multiple' ? (
                                  <>{String.fromCharCode(97 + index)}.</>
                                ) : (
                                  ''
                                )}

                                {questionType === 'check-box' ? (
                                  <div className="flex items-center space-x-2">
                                    <Checkbox disabled={true} id={`${index}`} />
                                  </div>
                                ) : (
                                  ''
                                )}
                              </div>
                              <div>
                                {questionType === 'multiple' ||
                                questionType === 'check-box' ? (
                                  <>
                                    <ReactQuill
                                      theme="snow"
                                      value={item.option}
                                      modules={editorConfig.modules}
                                      formats={editorConfig.formats}
                                    />
                                  </>
                                ) : (
                                  ''
                                )}
                              </div>

                              <div className={'flex gap-2 items-center'}>
                                <Switch
                                  id={'correct-ans'}
                                  checked={item.isCorrect}
                                  onClick={() => {
                                    setQuestionData((prev: any) => ({
                                      ...prev,
                                      options: questionData?.options.map(
                                        (tempOption: any) =>
                                          tempOption.id === item.id
                                            ? {
                                                ...tempOption,
                                                isCorrect:
                                                  !tempOption.isCorrect,
                                              }
                                            : tempOption
                                      ),
                                    }))
                                  }}
                                />
                                <Label
                                  htmlFor="correct-ans"
                                  className={'font-semibold'}
                                >
                                  Is Correct
                                </Label>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      ''
                    )}
                  </div>

                  {/*Sebelah kanan*/}
                  <div
                    className={'border rounded-lg p-3 flex flex-col w-52 gap-3'}
                  >
                    <span className={'font-bold'}>Question Type</span>

                    <div>
                      <RadioGroup
                        value={questionData?.type}
                        onValueChange={(value) => setQuestionType(value)}
                      >
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

                    <Input
                      type={'number'}
                      value={remarks}
                      onChange={(e) => setRemarks(+e.target.value)}
                    />
                  </div>
                </div>
              ) : (
                <p>Loading editor...</p>
              )}
            </div>
          </div>
        </div>
      </Card>
    </ContentLayout>
  )
}
