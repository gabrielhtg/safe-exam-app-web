'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import {
  Bolt,
  CalendarIcon,
  Check,
  ChevronsUpDown,
  CircleCheck,
  CirclePlay,
  CirclePlus,
  CircleX,
  Copy,
  EllipsisVertical,
  FileLock2,
  Loader2,
  Pen,
  Plus,
  Search,
  Trash,
  Users,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import { TimePickerDemo } from '@/components/custom-component/time-picker-demo'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatExamDate } from '@/app/_services/format-exam-date'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectUser } from '@/lib/_slices/userSlice'
import axios from 'axios'
import { apiUrl } from '@/lib/env'
import { getBearerHeader } from '@/app/_services/getBearerHeader.service'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'

export default function ExamPage() {
  const [dialogMsg, setDialogMsg] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogType, setDialogType] = useState(1)
  const [isLoadingCreate, setIsLoadingCreate] = useState(false)
  const [loadingTitle] = useState('')
  const [examName, setExamName] = useState('')
  const [examStartDate, setExamStartDate] = useState<Date>()
  const [examEndDate, setExamEndDate] = useState<Date>()
  const [examStartPassword, setExamStartPassword] = useState('')
  const [examStartRePassword, setExamStartRePassword] = useState('')
  const [examDescription] = useState('')
  const [exams, setExams] = useState([])
  const [courses, setcourses] = useState<any[]>([])
  const [popoverOpen, setPopoverOpen] = React.useState(false)
  const [courseInputValue, setCourseInputValue] = React.useState('')

  const [searchKeywords, setSearchKeywords] = useState('')
  const currentUsername = useSelector(selectUser).username

  const getAlertTitle = () => {
    if (dialogType == 1) {
      return (
        <>
          <CircleCheck className={'mb-3 text-green-500'} size={38} />
          Success
        </>
      )
    }

    if (dialogType == 0) {
      return (
        <>
          <CircleX className={'mb-3 text-red-600'} size={38} />
          Failed
        </>
      )
    }

    return ''
  }

  const getExam = async () => {
    try {
      const response = await axios.get(`${apiUrl}/exam`, {
        params: {
          uploader: currentUsername,
        },
        headers: getBearerHeader(localStorage.getItem('token')!).headers,
      })

      setExams(response.data.data)
    } catch (err: any) {
      console.log(err)
    }
  }

  const getCourses = async () => {
    try {
      const getResponse = await axios.get(`${apiUrl}/course`, {
        params: {
          uploader: currentUsername,
        },
        headers: getBearerHeader(localStorage.getItem('token')!).headers,
      })

      setcourses(getResponse.data.data)
    } catch (err: any) {
      console.log(err)
    }
  }

  const handleAddExam = async () => {
    if (examStartPassword === examStartRePassword) {
      const submitData = {
        title: examName,
        start_password: examStartPassword,
        start_date: examStartDate,
        end_date: examEndDate,
        course_title: courseInputValue,
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
          setDialogOpen(true)
          setDialogType(1)
          setDialogMsg(response.data.message)
          setIsLoadingCreate(false)
          getExam().then()
        }
      } catch (err: any) {
        setDialogOpen(true)
        setDialogType(0)
        setDialogMsg(err.response.data.message)
        setIsLoadingCreate(false)
      }
    } else {
      setDialogOpen(true)
      setDialogType(0)
      setDialogMsg('Start Password Not Same')
      setIsLoadingCreate(false)
    }
  }

  const handleDeleteExam = async (id: number) => {
    try {
      const deleteResponse = await axios.delete(`${apiUrl}/exam/${id}`, {
        headers: getBearerHeader(localStorage.getItem('token')!).headers,
      })

      if (deleteResponse.status === 200) {
        setDialogOpen(true)
        setDialogType(1)
        setDialogMsg(deleteResponse.data.message)
        setIsLoadingCreate(false)
        getExam().then()
      }
    } catch (err: any) {
      setDialogOpen(true)
      setDialogType(0)
      setDialogMsg(err.response.message)
      setIsLoadingCreate(false)
    }
  }

  useEffect(() => {
    getExam().then()
    getCourses().then()
  }, [currentUsername])

  return (
    <>
      <ContentLayout title="Exam">
        <Card
          id={'card-utama'}
          className={'w-full p-10 min-h-[calc(100vh-180px)]'}
        >
          <h3 className={'font-bold mb-5'}>Exam List</h3>

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

            <Button>
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

            <AlertDialog>
              <AlertDialogTrigger>
                <Button>
                  <Plus />
                  Add Exam
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Add Exam</AlertDialogTitle>
                  <AlertDialogDescription
                    className={'flex flex-col gap-5 mt-3'}
                  >
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
                    </div>

                    <div className="grid w-full items-center gap-1.5 ">
                      <Label htmlFor="exam-start-password">
                        Start Password
                      </Label>
                      <Input
                        type={'password'}
                        placeholder={'Type here...'}
                        id="exam-start-password"
                        onChange={(e) => {
                          setExamStartPassword(e.target.value)
                        }}
                      />
                    </div>

                    <div className="grid w-full items-center gap-1.5 ">
                      <Label htmlFor="exam-start-reenter-password">
                        Re-Enter Start Password
                      </Label>
                      <Input
                        type={'password'}
                        placeholder={'Type here...'}
                        id="exam-start-reenter-password"
                        onChange={(e) => {
                          setExamStartRePassword(e.target.value)
                        }}
                      />
                    </div>

                    <div className="grid w-full items-center gap-1.5 ">
                      <Label>Course</Label>
                      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={popoverOpen}
                            className="w-full justify-between"
                          >
                            {courseInputValue
                              ? courses.find(
                                  (course: any) =>
                                    course.title === courseInputValue
                                )?.title
                              : 'Select course...'}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search course..."
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>No framework found.</CommandEmpty>
                              <CommandGroup>
                                {courses.map((course: any) => (
                                  <CommandItem
                                    key={course.title}
                                    value={course.title}
                                    onSelect={(currentValue) => {
                                      setCourseInputValue(
                                        currentValue === courseInputValue
                                          ? ''
                                          : currentValue
                                      )
                                      setPopoverOpen(false)
                                    }}
                                  >
                                    {course.title}
                                    <Check
                                      className={cn(
                                        'ml-auto',
                                        courseInputValue === course.value
                                          ? 'opacity-100'
                                          : 'opacity-0'
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>

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
                          />
                          <div className="p-3 border-t border-border">
                            <TimePickerDemo
                              setDate={setExamStartDate}
                              date={examStartDate}
                            />
                          </div>
                        </PopoverContent>
                      </Popover>
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
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={examEndDate}
                            onSelect={setExamEndDate}
                          />
                          <div className="p-3 border-t border-border">
                            <TimePickerDemo
                              setDate={setExamEndDate}
                              date={examEndDate}
                            />
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleAddExam}>
                    Add
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <div className={'border rounded-lg w-full mt-7'}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>End Time</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exams.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className={'text-center p-5'}>
                      There are no exams yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  exams.map((exam: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{exam.title}</TableCell>
                      <TableCell>{exam.course_title}</TableCell>
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
                            <DropdownMenuItem>
                              <CirclePlay /> Simulate
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Bolt /> Configure
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <CirclePlus /> Add Question
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Users /> Manage Access
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileLock2 /> Generate Exam File
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy /> Copy Entry Password
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy /> Copy Submit Password
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

        <AlertDialog open={dialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle
                className={'text-center flex flex-col items-center'}
              >
                {getAlertTitle()}
              </AlertDialogTitle>
              <AlertDialogDescription className={'text-center'}>
                {dialogMsg}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className={'!justify-center'}>
              <Button
                onClick={() => {
                  setDialogOpen(false)
                }}
              >
                OK
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={isLoadingCreate}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle
                className={'text-center flex flex-col items-center'}
              >
                {loadingTitle}
              </AlertDialogTitle>
              <AlertDialogDescription
                className={'flex w-full justify-center mt-3'}
              >
                <Loader2 className="animate-spin w-10 h-10" />
              </AlertDialogDescription>
            </AlertDialogHeader>
          </AlertDialogContent>
        </AlertDialog>
      </ContentLayout>
    </>
  )
}
