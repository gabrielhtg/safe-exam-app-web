'use client'

import { Card } from '@/components/ui/card'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { getBearerHeader } from '@/app/_services/getBearerHeader.service'
import { toast } from 'sonner'
import { ReportDataTable } from '@/app/main/exam/report/(components)/report-data-table'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  ArrowUpDown,
  BookOpenCheck,
  EllipsisVertical,
  Eye,
  Info,
} from 'lucide-react'
import { formatExamDate } from '@/app/_services/format-exam-date'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Spinner } from '@/components/custom-component/Spinner'

export default function ReportPage({ params }: any) {
  const examId = params.id
  const [examData, setExamData] = useState<any>()
  const [allowedStudentData, setAllowedStudentData] = useState([])
  const [examResultData, setExamResultData] = useState([])

  const getNameByNim = (user_username: string) => {
    const person: any = allowedStudentData.find(
      (item: any) => item.nim === user_username
    )

    return person ? person.name : null
  }

  const getScorePercentage = (actual: string, expected: string) => {
    return ((+actual / +expected) * 100).toFixed(2)
  }

  const getExam = async () => {
    try {
      const response = await axios.get(
        `${process.env.API_URL}/exam/${examId}`,
        {
          headers: getBearerHeader(localStorage.getItem('token')!).headers,
        }
      )

      setExamData(response.data.data)
      getAllowedStudent(response.data.data.course_id).then()
    } catch (err: any) {
      toast.error(err.response.message)
    }
  }

  const getAllowedStudent = async (courseId: string) => {
    try {
      const response = await axios.get(
        `${process.env.API_URL}/allowed-student`,
        {
          params: {
            course_id: courseId,
          },
          headers: getBearerHeader(localStorage.getItem('token')!).headers,
        }
      )

      setAllowedStudentData(response.data.data)
    } catch (e: any) {
      toast.error(e.response.data.message)
    }
  }

  const getExamResult = async () => {
    try {
      const response = await axios.get(`${process.env.API_URL}/exam-result`, {
        headers: getBearerHeader(localStorage.getItem('token')!).headers,
        params: {
          exam: examId,
        },
      })

      if (response.status == 200) {
        setExamResultData(response.data.data)
      }
    } catch (e: any) {
      toast.error(e.response.message)
    }
  }

  const columns: ColumnDef<any>[] = [
    {
      id: 'no',
      header: 'No',
      cell: ({ row }) => {
        return <>{row.index + 1}</>
      },
    },
    {
      accessorKey: 'user_username',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className={'px-0 w-full justify-start'}
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            NIM
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        return <>{row.getValue('user_username')}</>
      },
    },
    {
      accessorKey: 'user_username',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className={'px-0 w-full justify-start'}
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        return <>{getNameByNim(row.getValue('user_username'))} </>
      },
    },
    {
      accessorKey: 'attempt',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className={'px-0 w-full justify-start'}
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Attempt
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        return <>{row.getValue('attempt')} </>
      },
    },
    {
      accessorKey: 'total_score',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className={'px-0 w-full justify-start'}
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Score
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        return <>{row.getValue('total_score')} </>
      },
    },
    {
      accessorKey: 'expected_score',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className={'px-0 w-full justify-start'}
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Expected Score
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        return <>{row.getValue('expected_score')} </>
      },
    },
    {
      accessorKey: 'graded',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className={'px-0 w-full justify-start'}
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Grade (%)
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      accessorFn: (row) => {
        const totalScore = row.total_score // Access total_score from data
        const expectedScore = row.expected_score // Access expected_score from data

        return (totalScore / expectedScore) * 100 // Calculate grade
      },
      cell: ({ row }) => {
        const totalScore = row.original.total_score // Access total_score
        const expectedScore = row.original.expected_score // Access expected_score

        return <>{getScorePercentage(totalScore, expectedScore)}</>
      },
      sortingFn: (a: any, b: any) => a.getValue('grade') - b.getValue('grade'),
    },
    {
      accessorKey: 'graded',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className={'px-0 w-full justify-start'}
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        if (row.getValue('graded')) {
          return <span className="text-green-500">Has been graded</span>
        } else {
          return <span className="text-yellow-500">Has not been graded</span>
        }
      },
    },
    {
      accessorKey: 'created_at',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className={'px-0 w-full justify-start'}
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Submitted At
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        return <>{formatExamDate(row.getValue('created_at'))} </>
      },
    },
    {
      accessorKey: 'indicated_cheating',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className={'px-0 w-full justify-start'}
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Cheating Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        if (row.getValue('indicated_cheating')) {
          return (
            <div className={'flex gap-2 items-center'}>
              <span className={'text-yellow-500'}>Suspected</span>
              <AlertDialog>
                <AlertDialogTrigger>
                  <Button variant={'outline'}>
                    <Info />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cheating Status Summary</AlertDialogTitle>
                    <AlertDialogDescription>
                      {row.original.cheating_summary === null ? (
                        <div
                          className={
                            'flex items-center justify-center flex-col mt-5 mb-5'
                          }
                        >
                          <Spinner />
                          <span className={'mt-3'}>
                            Please wait... We are trying to generate summary for
                            you.
                          </span>
                        </div>
                      ) : (
                        row.original.cheating_summary
                      )}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogAction>OK</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )
        } else {
          return <span className={'text-green-500'}>Not Suspected</span>
        }
      },
    },
    {
      accessorKey: 'action',
      header: () => {
        return (
          <Button variant="ghost" className={'px-0 w-full justify-start'}>
            Action
          </Button>
        )
      },
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={'secondary'}>
                <EllipsisVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link
                  href={`/main/exam/report/proctoring-log/${row.original.id}`}
                >
                  <Eye /> See Logs
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={`/main/exam/report/manual-grading/${row.original.id}`}
                >
                  <BookOpenCheck /> Manual Check
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={`/main/exam/report/review-result/${row.original.id}`}
                >
                  <BookOpenCheck /> Review Result
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  useEffect(() => {
    getExam().then()
    getExamResult().then()
  }, [])

  return (
    <ContentLayout title="Exam">
      <Card
        id={'card-utama'}
        className={'w-full p-10 min-h-[calc(100vh-180px)]'}
      >
        <h3 className={'font-bold mb-5'}>{examData?.title} Report</h3>

        <ReportDataTable
          columns={columns}
          allowedStudentData={allowedStudentData}
          data={examResultData}
          examData={examData}
        />
      </Card>
    </ContentLayout>
  )
}
