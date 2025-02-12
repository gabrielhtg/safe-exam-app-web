'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import {
  Bolt,
  CalendarIcon,
  Check,
  ChevronsUpDown,
  CirclePlay,
  CirclePlus,
  CircleX,
  Copy,
  EllipsisVertical,
  FileLock2,
  FileText,
  Plus,
  RefreshCcw,
  Search,
  Trash,
  UserCog,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
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
import { getBearerHeader } from '@/app/_services/getBearerHeader.service'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import Link from 'next/link'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'
import { BackButton } from '@/components/custom-component/BackButton'

export default function ExamPage() {
  const [examName, setExamName] = useState('')
  const [examStartDate, setExamStartDate] = useState<Date>()
  const [examEndDate, setExamEndDate] = useState<Date>()
  const [examDescription] = useState('')
  const [exams, setExams] = useState([])
  const [courses, setcourses] = useState<any[]>([])
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [courseInputValue, setCourseInputValue] = useState('')
  const [selectedCourseId, setSelectedCourseId] = useState('')
  const [showAddExamDialog, setShowAddExamDialog] = useState(false)

  const [searchKeywords, setSearchKeywords] = useState('')
  const currentUsername = useSelector(selectUser).username

  const [deleteExamDialog, setDeleteExamDialog] = useState(false)
  const [selectedDelete, setSelectedDelete] = useState()

  // error message holder
  const [examNameErr, setExamNameErr] = useState('')
  const [examStartDateErr, setExamStartDateErr] = useState('')
  const [examEndDateErr, setExamEndDateErr] = useState('')
  const [courseErr, setCourseErr] = useState('')

  const router = useRouter()

  const getExam = async () => {
    try {
      const response = await axios.get(`${process.env.API_URL}/exam`, {
        params: {
          uploader: currentUsername,
        },
        headers: getBearerHeader(localStorage.getItem('token')!).headers,
      })

      setExams(response.data.data)
    } catch (err: any) {
      toast.error(err.response.message)
    }
  }
  const handleGenerateNewConfigPassword = async (examId: number) => {
    try {
      const response = await axios.patch(
        `${process.env.API_URL}/exam/${examId}`,
        {
          config_password: 'new',
        },
        getBearerHeader(localStorage.getItem('token')!)
      )

      if (response.status === 200) {
        toast.success('New config password generated.')
        getExam().then()
      }
    } catch (e: any) {
      toast.error(e.response.message)
    }
  }

  const handleDownloadExamFile = async (examId: number) => {
    try {
      const response = await axios.get(
        `${process.env.API_URL}/exam/generate-file`,
        {
          params: {
            id: examId,
          },
          headers: getBearerHeader(localStorage.getItem('token')!).headers,
        }
      )

      if (response.status == 200) {
        window.location.href = `${process.env.API_URL}/${response.data.data}`
      }
    } catch (err: any) {
      toast.error(err.response.data.message)
    }
  }

  const getCourses = async () => {
    try {
      const getResponse = await axios.get(`${process.env.API_URL}/course`, {
        params: {
          uploader: currentUsername,
        },
        headers: getBearerHeader(localStorage.getItem('token')!).headers,
      })

      setcourses(getResponse.data.data)
    } catch (err: any) {
      toast.error(err.response.data.message)
    }
  }

  const handleAddExam = async () => {
    const submitData = {
      title: examName,
      start_date: examStartDate,
      end_date: examEndDate,
      course_id: selectedCourseId,
      created_by: currentUsername,
      description: examDescription,
    }

    try {
      const response = await axios.post(
        `${process.env.API_URL}/exam`,
        submitData,
        getBearerHeader(localStorage.getItem('token')!)
      )

      if (response.status === 200) {
        toast.success(response.data.message)
        getExam().then()
      }
    } catch (err: any) {
      toast.error(err.response.data.message)
    }

    setExamName('')
    setExamNameErr('')
    setExamStartDateErr('')
    setExamStartDate(undefined)
    setExamEndDateErr('')
    setExamEndDate(undefined)
    setCourseErr('')
  }

  const searchExam = async () => {
    try {
      const response = await axios.get(`${process.env.API_URL}/exam`, {
        params: {
          search: searchKeywords,
        },
        headers: getBearerHeader(localStorage.getItem('token')!).headers,
      })

      setExams(response.data.data)
    } catch (e: any) {
      toast.error(e.response.message)
    }
  }

  const handleDeleteExam = async (id: number) => {
    try {
      const deleteResponse = await axios.delete(
        `${process.env.API_URL}/exam/${id}`,
        {
          headers: getBearerHeader(localStorage.getItem('token')!).headers,
        }
      )

      if (deleteResponse.status === 200) {
        toast.success(deleteResponse.data.message)
        getExam().then()
      }
    } catch (err: any) {
      toast.error(err.response.message)
    }
  }

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (e: any) {
      toast.error(e.response.data.message)
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
              placeholder={'Search by exam title or course here...'}
              onChange={(e) => {
                setSearchKeywords(e.target.value)
              }}
            />

            <Button
              onClick={() => {
                searchExam().then()
              }}
            >
              <Search /> Search
            </Button>

            {searchKeywords !== '' ? (
              <Button
                onClick={() => {
                  setSearchKeywords('')
                  getExam().then()
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
              <AlertDialogTrigger asChild>
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
                      <span className={'text-red-500 text-sm'}>
                        {examNameErr}
                      </span>
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
                              <CommandEmpty>No course added.</CommandEmpty>
                              <CommandGroup>
                                {courses.map((course: any) => (
                                  <CommandItem
                                    key={course.id}
                                    value={course.title}
                                    onSelect={(currentValue) => {
                                      setCourseInputValue(
                                        currentValue === courseInputValue
                                          ? ''
                                          : currentValue
                                      )
                                      setSelectedCourseId(
                                        currentValue === courseInputValue
                                          ? ''
                                          : course.id
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
                      <span className={'text-red-500 text-sm'}>
                        {courseErr}
                      </span>
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
                      <span className={'text-red-500 text-sm'}>
                        {examEndDateErr}
                      </span>
                    </div>
                  </AlertDialogDescription>
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
                      setCourseErr('')
                    }}
                  >
                    Cancel
                  </AlertDialogCancel>
                  <Button
                    onClick={() => {
                      setExamNameErr('')
                      setExamStartDateErr('')
                      setExamEndDateErr('')
                      setCourseErr('')

                      if (examName === '') {
                        setExamNameErr('Cannot be blank!')
                        return
                      }

                      if (examStartDate === undefined) {
                        setExamStartDateErr('Cannot be blank!')
                        return
                      }

                      if (selectedCourseId === '') {
                        setCourseErr('Cannot be blank!')
                        return
                      }

                      if (examEndDateErr === undefined) {
                        setExamEndDateErr('Cannot be blank!')
                        return
                      }

                      if (examStartDate.getTime() < new Date().getTime()) {
                        setExamStartDateErr(
                          'The start date cannot be earlier current date and time'
                        )
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
                      setShowAddExamDialog(false)
                    }}
                  >
                    Add
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button
              onClick={() => {
                getExam().then()
                toast.success('Refreshed')
              }}
            >
              <RefreshCcw /> Refresh
            </Button>

            <BackButton />
          </div>
          <div className={'border rounded-lg w-full mt-7'}>
            <Table>
              <TableHeader>
                <TableRow className={'divide-x'}>
                  <TableHead>Name</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Start Password</TableHead>
                  <TableHead>End Password</TableHead>
                  <TableHead>Config Password</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>End Time</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exams.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className={'text-center p-5'}>
                      There are no exams yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  exams.map((exam: any, index: number) => (
                    <TableRow key={index} className={'divide-x'}>
                      <TableCell>{exam.title}</TableCell>
                      <TableCell>{exam.course.title}</TableCell>
                      <TableCell>
                        {exam.start_password ? exam.start_password : '-'}
                      </TableCell>
                      <TableCell>
                        {exam.end_password ? exam.end_password : '-'}
                      </TableCell>
                      <TableCell>
                        <div className={'font-mono flex items-center gap-3'}>
                          {exam.config_password ? exam.config_password : '-'}
                          <Button
                            variant={'outline'}
                            onClick={() => {
                              handleCopy(exam.config_password).then()
                              toast.success('Config password copied!')
                            }}
                          >
                            <Copy />
                          </Button>
                          <Button
                            variant={'outline'}
                            onClick={() => {
                              handleGenerateNewConfigPassword(exam.id).then()
                            }}
                          >
                            <RefreshCcw />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>{formatExamDate(exam.start_date)}</TableCell>
                      <TableCell>{formatExamDate(exam.end_date)}</TableCell>
                      <TableCell>
                        <DropdownMenu modal={false}>
                          <DropdownMenuTrigger asChild>
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
                            <DropdownMenuItem asChild={true}>
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
                                router.push(
                                  `/main/course/manage-access/${exam.course.id}`
                                )
                              }}
                            >
                              <UserCog /> Manage Access
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                router.push(`/main/exam/report/${exam.id}`)
                              }}
                            >
                              <FileText /> Open Report
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                handleCopy(exam.start_password).then()
                                toast.success('Start password copied!')
                              }}
                            >
                              <Copy /> Copy Start Exam Password
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                handleCopy(exam.end_password).then()
                                toast.success('End password copied!')
                              }}
                            >
                              <Copy /> Copy End Exam Password
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                handleCopy(
                                  `${process.env.FE_URL}/share/${exam.id}`
                                ).then()
                                toast.success('Share exam link copied!')
                              }}
                            >
                              <Copy /> Copy Share Exam Link
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                handleCopy(
                                  `${process.env.FE_URL}/exam-submit/${exam.id}`
                                ).then()
                                toast.success('Submit link copied!')
                              }}
                            >
                              <Copy /> Copy Submit Link
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className={'text-red-500'}
                              onClick={() => {
                                setDeleteExamDialog(true)
                                setSelectedDelete(exam.id)
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

        <Dialog open={deleteExamDialog} onOpenChange={setDeleteExamDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your
                exam and remove your data from our servers.
              </DialogDescription>
              <DialogFooter>
                <Button
                  variant={'secondary'}
                  onClick={() => {
                    setDeleteExamDialog(false)
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    handleDeleteExam(selectedDelete!).then()
                    setSelectedDelete(undefined)
                    setDeleteExamDialog(false)
                  }}
                >
                  Delete
                </Button>
              </DialogFooter>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </ContentLayout>
    </>
  )
}
