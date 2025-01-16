import Link from 'next/link'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  Bolt,
  CircleCheck,
  CirclePlay,
  CirclePlus,
  CircleX,
  Copy,
  EllipsisVertical,
  FileLock2,
  Plus,
  Trash,
} from 'lucide-react'
import { formatExamDate } from '@/app/_services/format-exam-date'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { apiUrl } from '@/lib/env'
import { getBearerHeader } from '@/app/_services/getBearerHeader.service'
import { useSelector } from 'react-redux'
import { selectUser } from '@/lib/_slices/userSlice'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export default function RecentExam() {
  const [exams, setExams] = useState([])
  const currentUsername = useSelector(selectUser).username
  const [dialogMsg, setDialogMsg] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogType, setDialogType] = useState(1)

  const [deleteExamDialog, setDeleteExamDialog] = useState(false)
  const [selectedDelete, setSelectedDelete] = useState()

  const handleDeleteExam = async (id: number) => {
    try {
      const deleteResponse = await axios.delete(`${apiUrl}/exam/${id}`, {
        headers: getBearerHeader(localStorage.getItem('token')!).headers,
      })

      if (deleteResponse.status === 200) {
        setDialogOpen(true)
        setDialogType(1)
        setDialogMsg(deleteResponse.data.message)
        getExam().then()
      }
    } catch (err: any) {
      setDialogOpen(true)
      setDialogType(0)
      setDialogMsg(err.response.message)
    }
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

  const handleCopy = async (text: string) => {
    try {
      console.log(navigator.clipboard)
      await navigator.clipboard.writeText(text)
    } catch (e: any) {
      console.log(e)
    }
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
      setDialogOpen(true)
      setDialogMsg(err.response.data.message)
      setDialogType(0)
    }
  }

  useEffect(() => {
    getExam().then()
  }, [currentUsername])

  return (
    <>
      <h2 className={'text-lg font-bold mt-10'}>Recent Exam</h2>

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
                <TableCell colSpan={5} className={'text-center h-52'}>
                  <span className={'text-base'}>There are no exams yet.</span>
                  <br />
                  <Button asChild={true} className={'mt-3'}>
                    <Link href={'/main/exam'}>
                      <Plus /> Add Exam
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ) : (
              exams.map((exam: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>{exam.title}</TableCell>
                  <TableCell>{exam.course.title}</TableCell>
                  <TableCell>{formatExamDate(exam.start_date)}</TableCell>
                  <TableCell>{formatExamDate(exam.end_date)}</TableCell>
                  <TableCell className={'flex gap-1'}>
                    <DropdownMenu modal={false}>
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
                              `${apiUrl}/exam-config/${exam.id}`
                            ).then()
                            toast.success('Download config link copied!')
                          }}
                        >
                          <Copy /> Copy Download Config Link
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className={'text-red-500'}
                          onClick={() => {
                            setSelectedDelete(exam.id)
                            setDeleteExamDialog(true)
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

      {exams.length > 0 ? (
        <div className={'w-full text-center mt-5'}>
          <Link href={'/main/exam'} className={'text-blue-500 hover:underline'}>
            See More
          </Link>
        </div>
      ) : (
        ''
      )}

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
    </>
  )
}
