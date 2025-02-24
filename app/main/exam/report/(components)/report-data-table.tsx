'use client'

import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ArrowLeft, FileText } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Workbook } from 'exceljs'
import { saveAs } from 'file-saver'
import { formatExamDate } from '@/app/_services/format-exam-date'

// interface DataTableProps<TData, TValue> {
//   columns: ColumnDef<TData, TValue>[]
//   data: TData[]
// }

export function ReportDataTable({
  columns,
  data,
  allowedStudentData,
  examData,
}: any) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })
  const router = useRouter()

  const getNameByNim = (user_username: string) => {
    const person: any = allowedStudentData.find(
      (item: any) => item.nim === user_username
    )

    return person ? person.name : null
  }

  const getScorePercentage = (actual: string, expected: string) => {
    return ((+actual / +expected) * 100).toFixed(2)
  }

  const exportToExcel = () => {
    const workbook = new Workbook()
    const worksheet = workbook.addWorksheet('Transaction Data')
    const columnOrder = [
      'user_username',
      'user_username',
      'attempt',
      'total_score',
      'expected_score',
      'graded',
      'Status',
      'Submitted At',
      'Is Cheating',
    ]
    const customHeaders = [
      'NIM',
      'Name',
      'Attempt',
      'Score',
      'Expected Score',
      'Grade',
      'Status',
      'Submitted At',
      'Is Cheating',
    ]

    // Add custom headers if provided
    const headerRow = worksheet.addRow(customHeaders)
    // Style the custom headers to make them bold
    headerRow.eachCell((cell: any) => {
      cell.font = { bold: true, color: { argb: '000000' } }
      cell.alignment = { vertical: 'middle', horizontal: 'center' }
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '75a1d0' }, // Ocean Blue background
      }
    })

    const mappedData = data.map((exam: any) => {
      const row: any = []

      row.push(exam.user_username)
      row.push(getNameByNim(exam.user_username))
      row.push(exam.attempt)
      row.push(+exam.total_score)
      row.push(+exam.expected_score)
      row.push(getScorePercentage(exam.total_score, exam.expected_score))
      row.push(exam.graded ? 'Has been graded' : 'Has not been graded')
      row.push(formatExamDate(exam.created_at))
      row.push(exam.indicated_cheating)

      return row
    })

    // Add data rows
    worksheet.addRows(mappedData)

    // Adjust column widths
    const allData = [customHeaders || columnOrder, ...mappedData]
    columnOrder.forEach((_, index) => {
      const maxLength = allData.reduce((max, row) => {
        const cellValue = row[index]?.toString() || ''
        return Math.max(max, cellValue.length)
      }, 0)
      worksheet.getColumn(index + 1).width = maxLength + 2 // Add padding
    })

    // Generate Excel file
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/octet-stream' })
      saveAs(blob, `${examData.course.title}-${examData.title} Report.xlsx`)
    })
  }

  return (
    <>
      <div className="flex items-center py-2 gap-3">
        <Input
          placeholder="Search NIM here ..."
          value={
            (table.getColumn('user_username')?.getFilterValue() as string) ?? ''
          }
          onChange={(event) =>
            table.getColumn('user_username')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        <Button
          onClick={() => {
            router.back()
          }}
        >
          <ArrowLeft /> Back
        </Button>

        <Button
          onClick={() => {
            exportToExcel()
          }}
        >
          <FileText /> Download Report
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className={'divide-x'}>
                {headerGroup.headers.map((header, index: number) => {
                  return (
                    <TableHead key={index}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index: number) => (
                <TableRow
                  key={index}
                  data-state={row.getIsSelected() && 'selected'}
                  className={'divide-x'}
                >
                  {row.getVisibleCells().map((cell, index: number) => (
                    <TableCell key={index}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
