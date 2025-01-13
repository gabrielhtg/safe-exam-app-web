'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Bolt,
  CalendarIcon,
  CirclePlay,
  CircleX,
  EllipsisVertical,
  Plus,
  Search,
  Trash,
  Copy,
  FileLock2,
  CirclePlus,
} from 'lucide-react'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { apiUrl } from '@/lib/env'
import { getBearerHeader } from '@/app/_services/getBearerHeader.service'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { useSelector } from 'react-redux'
import { selectUser } from '@/lib/_slices/userSlice'
import { TimePickerDemo } from '@/components/custom-component/time-picker-demo'
import { formatExamDate } from '@/app/_services/format-exam-date'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { toast } from 'sonner'

export default function CourseDetail({ params }: any) {
  const [examName, setExamName] = useState('')
  const [examStartDate, setExamStartDate] = useState<Date>()
  const [examEndDate, setExamEndDate] = useState<Date>()
  const [examStartPassword, setExamStartPassword] = useState('')
  const [examDescription] = useState('')
  const [exams, setExams] = useState([])
  const [showAddExamDialog, setShowAddExamDialog] = useState(false)

  const [searchKeywords, setSearchKeywords] = useState('')
  const currentUsername = useSelector(selectUser).username
  const [course, setCourse] = useState<any>({
    title: '',
    image: '',
    description: '',
  })

  // error message holder
  const [examNameErr, setExamNameErr] = useState('')
  const [examStartDateErr, setExamStartDateErr] = useState('')
  const [examEndDateErr, setExamEndDateErr] = useState('')

  const getCourse = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/course/${params.id}`,
        getBearerHeader(localStorage.getItem('token')!)
      )

      setCourse(response.data.data)
      getAllExams(response.data.data.id).then()
    } catch (err: any) {
      console.log(err)
    }
  }

  const handleCopy = async (text: string) => {
    try {
      console.log(navigator.clipboard)
      await navigator.clipboard.writeText(text)
    } catch (e: any) {
      console.log(e)
    }
  }

  const getAllExams = async (courseId: string) => {
    try {
      const response = await axios.get(`${apiUrl}/exam`, {
        params: {
          course: courseId,
          uploader: currentUsername,
        },
        headers: getBearerHeader(localStorage.getItem('token')!).headers,
      })

      setExams(response.data.data)
    } catch (err: any) {
      console.log(err)
    }
  }

  const handleDeleteExam = async (id: number) => {
    try {
      const deleteResponse = await axios.delete(`${apiUrl}/exam/${id}`, {
        headers: getBearerHeader(localStorage.getItem('token')!).headers,
      })

      if (deleteResponse.status === 200) {
        toast.success(deleteResponse.data.message)
        getAllExams(course.title).then()
      }
    } catch (err: any) {
      toast.error(err.response.message)
    }
  }

  const handleAddExam = async () => {
    const submitData = {
      title: examName,
      start_password: examStartPassword,
      start_date: examStartDate,
      end_date: examEndDate,
      course_id: course.id,
      created_by: currentUsername,
      description: examDescription,
    }

    try {
      const response = await axios.post(
        `${apiUrl}/exam`,
        submitData,
        getBearerHeader(localStorage.getItem('token')!)
      )

      if (response.status === 200) {
        toast.success(response.data.message)
        getAllExams(course.title).then()
      }
    } catch (err: any) {
      toast.error(err.response.data.message)
    }

    setExamName('')
    setExamNameErr('')
    setExamStartPassword('')
    setExamStartDateErr('')
    setExamStartDate(undefined)
    setExamEndDateErr('')
    setExamEndDate(undefined)
    setShowAddExamDialog(false)
  }

  const handleDownloadExamFile = async (examId: number) => {
    try {
      const response = await axios.get(`${apiUrl}/exam/generate-file`, {
        params: {
          id: examId,
        },
        headers: getBearerHeader(localStorage.getItem('token')!).headers,
      })

      if (response.status == 200) {
        window.location.href = `${apiUrl}/${response.data.data}`
      }
    } catch (err: any) {
      toast.error(err.response.data.message)
    }
  }

  useEffect(() => {
    getCourse().then()
  }, [])

  return (
    <ContentLayout title="Course">
      <Card
        id={'card-utama'}
        className={
          'flex flex-col gap-3 md:gap-5 p-10 min-h-[calc(100vh-180px)] rounded-lg shadow'
        }
      >
        <h1 className={'font-bold text-xl'}>{course.title}</h1>

        <p className={'text-muted-foreground'}>{course.description}</p>

        <hr />

        <h3>Exam List</h3>

        <div className={'flex gap-1'}>
          <Input
            type={'text'}
            className={'max-w-lg'}
            value={searchKeywords}
            placeholder={'Search here...'}
            onChange={(e) => {
              setSearchKeywords(e.target.value)
            }}
          />

          <Button
          // onClick={() => {
          //   searchCourse(searchKeywords!)
          // }}
          >
            <Search /> Search
          </Button>

          {searchKeywords !== '' ? (
            <Button
              onClick={() => {
                setSearchKeywords('')
                // searchCourse(undefined)
              }}
            >
              <CircleX /> Clear
            </Button>
          ) : (
            ''
          )}

          <AlertDialog
            open={showAddExamDialog}
            onOpenChange={setShowAddExamDialog}
          >
            <AlertDialogTrigger asChild={true}>
              <Button>
                <Plus />
                Add Exam
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Add Exam</AlertDialogTitle>
                <AlertDialogDescription></AlertDialogDescription>
                <div className={'flex flex-col gap-5 mt-3'}>
                  <div className="grid w-full items-center gap-1.5 mt-3">
                    <Label htmlFor="exam-name">Exam Name</Label>
                    <Input
                      type="text"
                      placeholder={'Type here...'}
                      id="exam-name"
                      onChange={(e) => {
                        setExamName(e.target.value)
                      }}
                    />
                    <span className={'text-red-500 text-sm'}>
                      {examNameErr}
                    </span>
                  </div>

                  {/*<div className="grid w-full items-center gap-1.5 ">*/}
                  {/*  <Label htmlFor="exam-start-password">Start Password</Label>*/}
                  {/*  <Input*/}
                  {/*    type={'text'}*/}
                  {/*    placeholder={'Type here...'}*/}
                  {/*    id="exam-start-password"*/}
                  {/*    onChange={(e) => {*/}
                  {/*      setExamStartPassword(e.target.value)*/}
                  {/*    }}*/}
                  {/*  />*/}
                  {/*</div>*/}

                  <div className="grid w-full items-center gap-1.5 ">
                    <Label>Exam Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            'justify-start text-left font-normal',
                            !examStartDate && 'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {examStartDate ? (
                            format(examStartDate, 'PPP HH:mm:ss')
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={examStartDate}
                          onSelect={setExamStartDate}
                          initialFocus
                        />
                        <div className="p-3 border-t border-border">
                          <TimePickerDemo
                            setDate={setExamStartDate}
                            date={examStartDate}
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                    <span className={'text-red-500 text-sm'}>
                      {examStartDateErr}
                    </span>
                  </div>

                  <div className="grid w-full items-center gap-1.5 ">
                    <Label>Exam End Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            'justify-start text-left font-normal',
                            !examEndDate && 'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {examEndDate ? (
                            format(examEndDate, 'PPP HH:mm:ss')
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 z-50">
                        <Calendar
                          mode="single"
                          selected={examEndDate}
                          onSelect={setExamEndDate}
                          initialFocus
                        />
                        <div className="p-3 border-t border-border">
                          <TimePickerDemo
                            setDate={setExamEndDate}
                            date={examEndDate}
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                    <span className={'text-red-500 text-sm'}>
                      {examEndDateErr}
                    </span>
                  </div>
                </div>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  onClick={() => {
                    setExamName('')
                    setExamNameErr('')
                    setExamStartDateErr('')
                    setExamStartDate(undefined)
                    setExamEndDateErr('')
                    setExamEndDate(undefined)
                  }}
                >
                  Cancel
                </AlertDialogCancel>
                <Button
                  onClick={() => {
                    setExamNameErr('')
                    setExamStartDateErr('')
                    setExamEndDateErr('')

                    if (examName === '') {
                      setExamNameErr('Cannot be blank!')
                      return
                    }

                    if (examStartDate === undefined) {
                      setExamStartDateErr('Cannot be blank!')
                      return
                    }

                    if (examEndDateErr === undefined) {
                      setExamEndDateErr('Cannot be blank!')
                      return
                    }

                    if (examStartDate.getTime() > examEndDate!.getTime()) {
                      setExamStartDateErr(
                        'The start date cannot be earlier than the end date.'
                      )
                      setExamEndDateErr(
                        'The end date cannot be later than the start date.'
                      )
                      return
                    }

                    handleAddExam().then()
                  }}
                >
                  Add
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className={'border rounded-lg w-full overflow-scroll'}>
          <Table>
            <TableHeader>
              <TableRow className={'divide-x'}>
                <TableHead>Name</TableHead>
                <TableHead>Start Password</TableHead>
                <TableHead>Close Password</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>End Time</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exams.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className={'text-center p-5'}>
                    There are no exams in this course yet.
                  </TableCell>
                </TableRow>
              ) : (
                exams.map((exam: any, index: number) => (
                  <TableRow key={index} className={'divide-x'}>
                    <TableCell>{exam.title}</TableCell>
                    <TableCell>
                      {exam.start_password ? exam.start_password : '-'}
                    </TableCell>
                    <TableCell>
                      {exam.end_password ? exam.end_password : '-'}
                    </TableCell>
                    <TableCell>{formatExamDate(exam.start_date)}</TableCell>
                    <TableCell>{formatExamDate(exam.end_date)}</TableCell>
                    <TableCell className={'flex gap-1'}>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button variant={'secondary'}>
                            <EllipsisVertical />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem asChild>
                            <Link
                              className={'flex'}
                              href={`/main/exam/simulate/${exam.id}`}
                            >
                              <CirclePlay /> Simulate
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link
                              className={'flex'}
                              href={`/main/exam/configure/${exam.id}`}
                            >
                              <Bolt /> Configure
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link
                              className={'flex'}
                              href={`/main/exam/question/${exam.id}`}
                            >
                              <CirclePlus /> Add Question
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              handleDownloadExamFile(exam.id).then()
                            }}
                          >
                            <FileLock2 /> Generate Exam File
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              handleCopy(exam.config_password).then()
                            }}
                          >
                            <Copy /> Copy Configuration Password
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              handleCopy(exam.start_password).then()
                            }}
                          >
                            <Copy /> Copy Start Exam Password
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              handleCopy(exam.end_password).then()
                            }}
                          >
                            <Copy /> Copy Close Exam Password
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className={'text-red-500'}
                            onClick={() => {
                              handleDeleteExam(exam.id)
                            }}
                          >
                            <Trash /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </ContentLayout>
  )
}
