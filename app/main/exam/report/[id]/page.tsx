'use client'

import { Card } from '@/components/ui/card'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { apiUrl } from '@/lib/env'
import { getBearerHeader } from '@/app/_services/getBearerHeader.service'
import { toast } from 'sonner'
import { ReportDataTable } from '@/app/main/exam/report/(components)/report-data-table'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { ArrowUpDown } from 'lucide-react'
import { formatExamDate } from '@/app/_services/format-exam-date'

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
    return `(${((+actual / +expected) * 100).toFixed(2)}%)`
  }

  const getExam = async () => {
    try {
      const response = await axios.get(`${apiUrl}/exam/${examId}`, {
        headers: getBearerHeader(localStorage.getItem('token')!).headers,
      })

      setExamData(response.data.data)
      getAllowedStudent(response.data.data.course_id).then()
    } catch (err: any) {
      toast.error(err.response.message)
    }
  }

  const getAllowedStudent = async (courseId: string) => {
    try {
      const response = await axios.get(`${apiUrl}/allowed-student`, {
        params: {
          course_id: courseId,
        },
        headers: getBearerHeader(localStorage.getItem('token')!).headers,
      })

      setAllowedStudentData(response.data.data)
    } catch (e: any) {
      console.log(e)
    }
  }

  const getExamResult = async () => {
    try {
      const response = await axios.get(`${apiUrl}/exam-result`, {
        headers: getBearerHeader(localStorage.getItem('token')!).headers,
        params: {
          exam: examId,
        },
      })

      if (response.status == 200) {
        setExamResultData(response.data.data)
        console.log(response.data.data)
      }
    } catch (e: any) {
      toast.error(e.response.message)
    }
  }

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'user_username',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className={'px-0'}
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
            className={'px-0'}
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
            className={'px-0'}
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
            className={'px-0'}
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Total Score
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const totalScore = row.original.total_score // Access total_score
        const expectedScore = row.original.expected_score // Access expected_score

        return (
          <>
            {totalScore} / {expectedScore}{' '}
            <span className="font-bold">
              {getScorePercentage(totalScore, expectedScore)}
            </span>
          </>
        )
      },
    },
    {
      accessorKey: 'created_at',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className={'px-0'}
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

        <ReportDataTable columns={columns} data={examResultData} />
      </Card>
    </ContentLayout>
  )
}
