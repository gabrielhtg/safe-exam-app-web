'use client'

import React, { useEffect, useState } from 'react'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import { Card } from '@/components/ui/card'
import axios from 'axios'
import { apiUrl } from '@/lib/env'
import { getBearerHeader } from '@/app/_services/getBearerHeader.service'
import { DataTable } from '@/app/main/questions/(components)/data-table'
import { ColumnDef } from '@tanstack/react-table'
import parse from 'html-react-parser'
import { Button } from '@/components/ui/button'
import { ArrowUpDown, EllipsisVertical, Trash } from 'lucide-react'
import { format } from 'date-fns'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'

export type Question = {
  content: string
  type: string
  point: number
  course: string
  created_at: Date
}

export default function QuestionsPage() {
  const [questionData, setQuestionData] = useState<any>()

  const getAllQuestion = async () => {
    try {
      const data = await axios.get(`${apiUrl}/question`, {
        headers: getBearerHeader(localStorage.getItem('token')!).headers,
      })

      setQuestionData(data.data.data)
    } catch (e: any) {
      toast.error(e.response.data.message)
    }
  }

  useEffect(() => {
    getAllQuestion().then()
  }, [])

  const columns: ColumnDef<Question>[] = [
    {
      accessorKey: 'content',
      header: () => {
        return <div className={'text-center w-full'}>Question</div>
      },
      cell: ({ row }) => {
        return parse(row.getValue('content'))
      },
    },
    {
      accessorKey: 'type',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Type
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        return <div className={'text-center'}>{row.getValue('type')}</div>
      },
    },
    {
      accessorKey: 'point',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Score
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        return <div className={'text-center'}>{row.getValue('point')}</div>
      },
    },
    {
      accessorKey: 'course_title',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Course
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        return (
          <div className={'text-center'}>{row.getValue('course_title')}</div>
        )
      },
    },
    {
      accessorKey: 'created_at',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Created At
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        return (
          <div className={'text-center'}>
            {format(row.getValue('created_at'), 'EEE, dd MMM yyyy')}
          </div>
        )
      },
    },
    {
      id: 'action',
      header: 'Actions',
      cell: ({ row }) => {
        const question: any = row.original
        const handleDeleteQuestion = async () => {
          try {
            const response = await axios.delete(
              `${apiUrl}/question/${question.id}`,
              getBearerHeader(localStorage.getItem('token')!)
            )

            if (response.status === 200) {
              getAllQuestion().then()
            }
          } catch (error: any) {
            toast.error(error.response.data.message)
          }
        }

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={'secondary'}>
                <EllipsisVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                className={'text-red-500'}
                onClick={() => {
                  handleDeleteQuestion().then()
                }}
              >
                <Trash /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return (
    <ContentLayout title="Questions">
      <Card
        id={'card-utama'}
        className={
          'flex flex-col gap-3 md:gap-5 p-10 min-h-[calc(100vh-180px)] rounded-lg shadow'
        }
      >
        <h2 className={'text-2xl font-bold mb-3'}>Question Bank</h2>

        {questionData ? (
          <DataTable columns={columns} data={questionData} />
        ) : (
          ''
        )}
      </Card>
    </ContentLayout>
  )
}
