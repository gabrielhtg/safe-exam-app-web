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
import { Button } from '@/components/ui/button'
import parse from 'html-react-parser'
import { useSelector } from 'react-redux'
import { selectUser } from '@/lib/_slices/userSlice'
import {
  ArrowLeft,
  CircleX,
  EllipsisVertical,
  Landmark,
  Pen,
  RotateCcw,
  Trash2,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { stripHtml } from '@/app/_services/strip-html'
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

export default function ExamQuestionPage({ params }: any) {
  const id = params.id
  const [questions, setQuestions] = useState([])
  const [tempContent, setTempContent] = useState('')
  const [tempOptions, setTempOptions] = useState<any[]>([])
  const [value, setValue] = useState('')
  const [remarks, setRemarks] = useState<number>(1)
  const [questionType, setQuestionType] = useState('multiple')
  const [editorConfig, setEditorConfig] = useState<any>(null)
  const currentUsername = useSelector(selectUser).username
  const [examData, setExamData] = useState<any>(null)
  const [isOptionCorrect, setIsOptionCorrect] = useState<boolean>(false)
  const [showCorrectSwitch, setShowCorrectSwitch] = useState(true)
  const router = useRouter()
  const [allQuestionData, setAllQuestionData] = useState<any[]>([])
  const [showAddQuestionDialog, setShowAddQuestionDialog] = useState(false)

  const getAllQuestions = async () => {
    try {
      const response = await axios.get(`${process.env.API_URL}/question`, {
        params: {
          exam: id,
        },

        headers: getBearerHeader(localStorage.getItem('token')!).headers,
      })

      setQuestions(response.data.data)
    } catch (err: any) {
      toast.error(err.response.data.message)
    }
  }

  const getExamData = async () => {
    const response = await axios.get(
      `${process.env.API_URL}/exam/${id}`,
      getBearerHeader(localStorage.getItem('token')!)
    )

    setExamData(response.data.data)
  }

  const handleDelete = async (questionId: number) => {
    try {
      const response = await axios.delete(
        `${process.env.API_URL}/question/${questionId}`,
        getBearerHeader(localStorage.getItem('token')!)
      )

      if (response.status === 200) {
        getAllQuestions().then()
        toast.success(response.data.message)
      }
    } catch (error: any) {
      toast.error(error.response.data.message)
    }
  }

  const handleGetAllQuestion = async () => {
    try {
      const response = await axios.get(`${process.env.API_URL}/question`, {
        headers: getBearerHeader(localStorage.getItem('token')!).headers,
        params: {
          course: examData.course.id,
        },
      })

      setAllQuestionData(response.data.data)
    } catch (e: any) {
      toast.error(`Fail to get all question. ${e.response.message}`)
    }
  }

  const handleSaveQuestion = async () => {
    if (tempContent === '' && questionType !== 'essay') {
      getAllQuestions().then()
      toast.error('Questions cannot be empty!')
      return
    }

    if (value === '' && questionType === 'essay') {
      getAllQuestions().then()
      toast.error('Questions cannot be empty!')
      return
    }

    if (
      !tempOptions.some((item) => item.isCorrect === true) &&
      questionType !== 'essay'
    ) {
      setTempContent('')
      setTempOptions([])
      setShowCorrectSwitch(true)
      setIsOptionCorrect(false)
      setValue('')
      toast.error('There must be at least 1 correct answer.')
      return
    }

    console.log(tempOptions)

    try {
      const saveResponse = await axios.post(
        `${process.env.API_URL}/question`,
        {
          content: questionType === 'essay' ? value : tempContent,
          type: questionType,
          options: tempOptions,
          remarks: remarks,
          course: examData.course_id,
          created_by: currentUsername,
          exam_id: id,
        },
        getBearerHeader(localStorage.getItem('token')!)
      )

      if (saveResponse.status === 200) {
        getAllQuestions().then()
        toast.success(saveResponse.data.message)
      }
    } catch (err: any) {
      toast.success(err.response.message)
    }
  }

  const handleAddFromQuestionBank = async (
    content: string,
    questionTypeParam: string,
    optionsParam: any,
    remarksParam: any,
    questionId: number
  ) => {
    try {
      const saveResponse = await axios.post(
        `${process.env.API_URL}/question`,
        {
          content: content,
          type: questionTypeParam,
          options: optionsParam,
          remarks: remarksParam,
          course: examData.course_id,
          created_by: currentUsername,
          exam_id: id,
          question_id: questionId,
        },
        getBearerHeader(localStorage.getItem('token')!)
      )

      if (saveResponse.status === 200) {
        getAllQuestions().then()
        toast.success(saveResponse.data.message)
      }
    } catch (err: any) {
      toast.error(err.response.data.message)
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
    <ContentLayout title="Exam Question">
      <Card
        id={'card-utama'}
        className={'w-full p-10 min-h-[calc(100vh-180px)]'}
      >
        <h3 className={'font-bold text-xl mb-5'}>
          {examData?.title} Question List
        </h3>

        <Button
          onClick={() => {
            router.back()
          }}
          className={'mb-3'}
        >
          <ArrowLeft /> Back
        </Button>

        <div id={'tempat-deskripsi'} className={'mb-3'}>
          Total Questions : {questions.length}
        </div>

        <div className={'flex flex-col gap-5'}>
          <div className={'flex flex-col gap-5 max-h-72 overflow-auto'}>
            {questions.map((e: any, index) => (
              <div key={index} className={'flex gap-3 border rounded-lg p-5'}>
                <div>{index + 1}.</div>
                <div className={'w-full h-auto'}>
                  {parse(e.content)}
                  <div className={'flex ms-5 flex-col mt-2'}>
                    {e.options.map((item: any, index: number) => (
                      <div key={index} className={'flex items-center gap-3'}>
                        <div>
                          {e.type === 'multiple' ? (
                            <>{String.fromCharCode(97 + index)}.</>
                          ) : (
                            ''
                          )}

                          {e.type === 'check-box' ? (
                            <div className="flex items-center space-x-2">
                              <Checkbox disabled={true} id={`${index}`} />
                            </div>
                          ) : (
                            ''
                          )}
                        </div>
                        <div className={item.isCorrect ? 'bg-green-200' : ''}>
                          {e.type === 'multiple' ? (
                            <>{parse(item.option)}</>
                          ) : (
                            ''
                          )}

                          {e.type === 'check-box' ? (
                            <label
                              htmlFor={`${index}`}
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
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant={'secondary'}>
                      <EllipsisVertical />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => {
                        router.push(`/main/exam/question/edit/${e.id}`)
                      }}
                    >
                      <Pen />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        handleDelete(e.id)
                      }}
                    >
                      <Trash2 />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>

          <div className={'flex gap-3 border rounded-lg p-5'}>
            <div>{questions.length + 1}</div>
            <div className={'w-full'}>
              {tempContent ? (
                <div className={'mb-3'}>
                  {parse(tempContent)}

                  {tempOptions?.length > 0 ? (
                    <div className={'flex ms-5 flex-col mt-2'}>
                      {tempOptions?.map((item: any, index: number) => (
                        <div key={index} className={'flex items-center gap-3'}>
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
                          <div className={item.isCorrect ? 'bg-green-200' : ''}>
                            {questionType === 'multiple' ? (
                              <>{parse(item.option)}</>
                            ) : (
                              ''
                            )}

                            {questionType === 'check-box' ? (
                              <label
                                htmlFor={`${index}`}
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
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              ) : (
                ''
              )}
              {editorConfig ? (
                <div className={'flex gap-3 w-full'}>
                  <div className={'w-full'}>
                    <ReactQuill
                      theme="snow"
                      value={value}
                      onChange={setValue}
                      modules={editorConfig.modules}
                      formats={editorConfig.formats}
                    />
                    <div className={'mt-3'}>
                      {tempContent === '' ? (
                        <>
                          {questionType !== 'essay' ? (
                            <div className={'flex gap-3'}>
                              <Button
                                onClick={() => {
                                  if (
                                    value !== '' &&
                                    value !== '<p><br></p>' &&
                                    stripHtml(value).trim() !== ''
                                  ) {
                                    setTempContent(value)
                                    setValue('')
                                  } else {
                                    toast.error("Question can't be empty.")
                                  }
                                }}
                              >
                                Add Option
                              </Button>

                              <Button variant={'outline'} asChild>
                                <Link href={'/main/exam'}>
                                  Done Add Question
                                </Link>
                              </Button>

                              <Dialog open={showAddQuestionDialog}>
                                <DialogTrigger>
                                  <Button
                                    variant={'outline'}
                                    onClick={() => {
                                      setShowAddQuestionDialog(true)
                                      handleGetAllQuestion().then()
                                    }}
                                  >
                                    <Landmark /> Question Bank
                                  </Button>
                                </DialogTrigger>
                                <DialogContent
                                  className={
                                    'max-w-4xl w-full max-h-[calc(100vh-100px)]'
                                  }
                                >
                                  <div>
                                    <DialogHeader>
                                      <DialogTitle>
                                        <span className={'text-2xl'}>
                                          Select the question you want to add
                                        </span>
                                      </DialogTitle>
                                    </DialogHeader>

                                    <div className={'mt-5'}>
                                      <Button
                                        onClick={() => {
                                          setShowAddQuestionDialog(false)
                                        }}
                                      >
                                        <CircleX /> Close
                                      </Button>
                                    </div>

                                    <div
                                      className={
                                        'border rounded-lg mt-4 overflow-y-auto max-h-[calc(100vh-260px)]'
                                      }
                                    >
                                      <Table>
                                        <TableHeader>
                                          <TableRow className={'divide-x'}>
                                            <TableHead>Question</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Action</TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {allQuestionData?.map(
                                            (
                                              questionDataItem: any,
                                              index: number
                                            ) => (
                                              <TableRow
                                                key={index}
                                                className={'divide-x'}
                                              >
                                                <TableCell>
                                                  {parse(
                                                    questionDataItem.content
                                                  )}
                                                </TableCell>
                                                <TableCell>
                                                  {questionDataItem.type}
                                                </TableCell>
                                                <TableCell>
                                                  <DialogClose asChild>
                                                    <Button
                                                      variant={'secondary'}
                                                      onClick={() => {
                                                        setShowAddQuestionDialog(
                                                          false
                                                        )
                                                        handleAddFromQuestionBank(
                                                          questionDataItem.content,
                                                          questionDataItem.type,
                                                          questionDataItem.options,
                                                          questionDataItem.point,
                                                          questionDataItem.id
                                                        ).then()
                                                      }}
                                                    >
                                                      Select
                                                    </Button>
                                                  </DialogClose>
                                                </TableCell>
                                              </TableRow>
                                            )
                                          )}
                                        </TableBody>
                                      </Table>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          ) : (
                            <div className={'flex gap-3'}>
                              <Button
                                onClick={() => {
                                  handleSaveQuestion().then()
                                  setValue('')
                                  setRemarks(1)
                                  setTempContent('')
                                  setTempOptions([])
                                  setIsOptionCorrect(false)
                                  setShowCorrectSwitch(true)
                                }}
                              >
                                Save Question
                              </Button>
                              <Button variant={'outline'} asChild>
                                <Link href={'/main/exam'}>
                                  Done Add Question
                                </Link>
                              </Button>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className={'flex gap-3'}>
                          <Button
                            onClick={() => {
                              if (
                                value !== '' &&
                                value !== '<p><br></p>' &&
                                stripHtml(value).trim() !== ''
                              ) {
                                setTempOptions((prevOptions) => [
                                  ...prevOptions,
                                  {
                                    option: value,
                                    isCorrect: isOptionCorrect,
                                  },
                                ])

                                setValue('')

                                if (questionType === 'multiple') {
                                  if (isOptionCorrect) {
                                    setShowCorrectSwitch(false)
                                  }
                                }
                                setIsOptionCorrect(false)
                              } else {
                                toast.error("Option can't be empty.")
                              }
                            }}
                          >
                            {value === '' || value === '<p><br></p>'
                              ? 'Add Option'
                              : 'Save Option'}
                          </Button>

                          {tempOptions?.length > 1 &&
                          (value === '' || value === '<p><br></p>') ? (
                            <Button
                              onClick={() => {
                                handleSaveQuestion()
                                setValue('')
                                setRemarks(1)
                                setTempContent('')
                                setTempOptions([])
                                setIsOptionCorrect(false)
                                setShowCorrectSwitch(true)
                              }}
                            >
                              Save Question
                            </Button>
                          ) : (
                            ''
                          )}

                          <Button
                            onClick={() => {
                              setTempContent('')
                              setTempOptions([])
                              setShowCorrectSwitch(true)
                              setIsOptionCorrect(false)
                              setValue('')
                            }}
                          >
                            <RotateCcw />
                          </Button>

                          {showCorrectSwitch ? (
                            <div className={'flex items-center gap-3'}>
                              <Switch
                                id={'correct-ans'}
                                checked={isOptionCorrect}
                                onCheckedChange={(e) => {
                                  setIsOptionCorrect(e)
                                }}
                              />
                              <Label htmlFor="correct-ans">
                                Correct Answer
                              </Label>
                            </div>
                          ) : (
                            ''
                          )}
                        </div>
                      )}
                    </div>
                  </div>
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
                            disabled={tempContent !== ''}
                            id="multiple"
                            aria-selected={true}
                          />
                          <Label htmlFor="multiple">Multiple Choice</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            disabled={tempContent !== ''}
                            value="essay"
                            id="essay"
                          />
                          <Label htmlFor="essay">Essay</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            disabled={tempContent !== ''}
                            value="check-box"
                            id="check-box"
                          />
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
