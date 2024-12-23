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
  CirclePlay,
  CirclePlus,
  Copy,
  EllipsisVertical,
  FileLock2,
  Pen,
  Plus,
  Trash,
  Users,
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

export default function RecentExam() {
  const [exams, setExams] = useState([])
  const currentUsername = useSelector(selectUser).username

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
                          <Pen /> Edit
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
                        <DropdownMenuItem className={'text-red-500'}>
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
          <Link
            href={'/app/main/course'}
            className={'text-blue-500 hover:underline'}
          >
            See More
          </Link>
        </div>
      ) : (
        ''
      )}
    </>
  )
}
