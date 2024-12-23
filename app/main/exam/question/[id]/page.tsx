'use client'

import { Card } from '@/components/ui/card'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import React, { useEffect, useState } from 'react'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import 'react-quill/dist/quill.snow.css'
import { Input } from '@/components/ui/input'
import dynamic from 'next/dynamic'
import { getBearerHeader } from '@/app/_services/getBearerHeader.service'
import axios from 'axios'
import { apiUrl } from '@/lib/env'
import { Button } from '@/components/ui/button'
import parse from 'html-react-parser'
import { useSelector } from 'react-redux'
import { selectUser } from '@/lib/_slices/userSlice'
import { Pen, Trash2 } from 'lucide-react'
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

export default function ExamQuestionPage({ params }: any) {
  const id = params.id
  const [questions, setQuestions] = useState([])
  const [tempContent, setTempContent] = useState('')
  const [tempOptions, setTempOptions] = useState<string[]>([])
  const [value, setValue] = useState('')
  const [remarks, setRemarks] = useState<number>(0)
  const [questionType, setQuestionType] = useState('multiple')
  const [editorConfig, setEditorConfig] = useState<any>(null)
  const currentUsername = useSelector(selectUser).username
  const [examData, setExamData] = useState<any>(null)

  const getAllQuestions = async () => {
    try {
      const response = await axios.get(`${apiUrl}/question`, {
        params: {
          exam: id,
        },
        headers: getBearerHeader(localStorage.getItem('token')!).headers,
      })

      setQuestions(response.data.data)
    } catch (err: any) {
      console.log(err)
    }
  }

  const getExamData = async () => {
    const response = await axios.get(
      `${apiUrl}/exam/${id}`,
      getBearerHeader(localStorage.getItem('token')!)
    )

    setExamData(response.data.data)
  }

  const handleSaveQuestion = async () => {
    const options = {
      list: tempOptions,
    }

    try {
      const saveResponse = await axios.post(
        `${apiUrl}/question`,
        {
          content: tempContent,
          type: questionType,
          options: options,
          remarks: remarks,
          course: examData.course_title,
          created_by: currentUsername,
          exam_id: id,
        },
        getBearerHeader(localStorage.getItem('token')!)
      )
      getAllQuestions().then()
      console.log(saveResponse.data.data)
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
    getAllQuestions().then()
    getExamData().then()
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

        <div className={'flex flex-col gap-5'}>
          {questions.map((e: any, index) => (
            <div key={index} className={'flex gap-3'}>
              <div className={'border rounded-lg p-3 flex flex-col w-52 gap-3'}>
                <span className={'font-bold'}>Actions</span>

                <div className={'flex gap-2'}>
                  <Button variant={'secondary'}>
                    <Pen />
                  </Button>
                  <Button variant={'secondary'}>
                    <Trash2 />
                  </Button>
                </div>
              </div>

              <div>{index + 1}.</div>
              <div className={'w-full h-auto'}>
                {parse(e.content)}
                <div className={'flex ms-5 flex-col mt-2'}>
                  {e.options.list.map((item: string, index: number) => (
                    <div key={index} className={'flex gap-3'}>
                      <div>{String.fromCharCode(97 + index)}.</div>
                      <div>{parse(item)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <div className={'flex gap-3'}>
            <div>{questions.length + 1}</div>
            <div className={'w-full h-auto'}>
              {tempContent ? (
                <div className={'mb-3'}>
                  {parse(tempContent)}

                  {tempOptions.length > 0 ? (
                    <div className={'flex ms-5 flex-col mt-2'}>
                      {tempOptions.map((item: string, index: number) => (
                        <div key={index} className={'flex gap-3'}>
                          <div>{String.fromCharCode(97 + index)}.</div>
                          <div>{parse(item)}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              ) : (
                ''
              )}
              {editorConfig ? (
                <>
                  <div
                    className={'border rounded-lg p-3 flex flex-col w-52 gap-3'}
                  >
                    <span className={'font-bold'}>Question Type</span>

                    <div>
                      <RadioGroup
                        value={questionType}
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
                  <ReactQuill
                    theme="snow"
                    value={value}
                    onChange={setValue}
                    modules={editorConfig.modules}
                    formats={editorConfig.formats}
                  />
                  <div className={'mt-3'}>
                    {tempContent === '' ? (
                      <Button
                        onClick={() => {
                          setTempContent(value)
                          setValue('')
                        }}
                      >
                        Add Option
                      </Button>
                    ) : (
                      <div className={'flex gap-3'}>
                        <Button
                          onClick={() => {
                            setTempOptions((prevOptions) => [
                              ...prevOptions,
                              value,
                            ])

                            setValue('')
                          }}
                        >
                          Save Option
                        </Button>

                        {tempOptions.length > 1 ? (
                          <Button
                            onClick={() => {
                              handleSaveQuestion().then()
                              setValue('')
                              setTempContent('')
                              setTempOptions([])
                            }}
                          >
                            Save Question
                          </Button>
                        ) : (
                          ''
                        )}
                      </div>
                    )}
                  </div>
                </>
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
