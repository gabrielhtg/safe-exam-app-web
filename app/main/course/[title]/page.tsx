'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CircleCheck, CircleX, Eye, Loader2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import axios from 'axios'
import { apiUrl } from '@/lib/env'
import { getBearerHeader } from '@/app/_services/getBearerHeader.service'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function CoursePage({ params }: any) {
  const [dialogMsg, setDialogMsg] = useState('')
  const [errDialog, setErrDialog] = useState(false)
  const [dialogType, setDialogType] = useState(1)
  const [isLoadingCreate, setIsLoadingCreate] = useState(false)
  const [loadingTitle, setLoadingTitle] = useState('')

  const [course, setCourse] = useState<any>({
    title: '',
    image: '',
    description: '',
  })

  const getCourse = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/course/${params.title}`,
        getBearerHeader(localStorage.getItem('token')!)
      )

      setCourse(response.data.data)
    } catch (err: any) {
      console.log(err)
    }
  }

  useEffect(() => {
    getCourse().then()
  }, [])

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
        <div className={'border rounded-lg w-full'}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>End Time</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>EXAM-MPTI-01</TableCell>
                <TableCell>Ujian Tengah Semester MPTI</TableCell>
                <TableCell>MPTI</TableCell>
                <TableCell>Thu Oct 17 2024 13:10:56.772</TableCell>
                <TableCell>Wed Jun 25 1975 08:30:00.000</TableCell>
                <TableCell>
                  <Button>
                    <Eye />
                  </Button>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>EXAM-MPTI-01</TableCell>
                <TableCell>Ujian Tengah Semester MPTI</TableCell>
                <TableCell>MPTI</TableCell>
                <TableCell>Thu Oct 17 2024 13:10:56.772</TableCell>
                <TableCell>Wed Jun 25 1975 08:30:00.000</TableCell>
                <TableCell>
                  <Button>
                    <Eye />
                  </Button>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>EXAM-MPTI-01</TableCell>
                <TableCell>Ujian Tengah Semester MPTI</TableCell>
                <TableCell>MPTI</TableCell>
                <TableCell>Thu Oct 17 2024 13:10:56.772</TableCell>
                <TableCell>Wed Jun 25 1975 08:30:00.000</TableCell>
                <TableCell>
                  <Button>
                    <Eye />
                  </Button>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>EXAM-MPTI-01</TableCell>
                <TableCell>Ujian Tengah Semester MPTI</TableCell>
                <TableCell>MPTI</TableCell>
                <TableCell>Thu Oct 17 2024 13:10:56.772</TableCell>
                <TableCell>Wed Jun 25 1975 08:30:00.000</TableCell>
                <TableCell>
                  <Button>
                    <Eye />
                  </Button>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>EXAM-MPTI-01</TableCell>
                <TableCell>Ujian Tengah Semester MPTI</TableCell>
                <TableCell>MPTI</TableCell>
                <TableCell>Thu Oct 17 2024 13:10:56.772</TableCell>
                <TableCell>Wed Jun 25 1975 08:30:00.000</TableCell>
                <TableCell>
                  <Button>
                    <Eye />
                  </Button>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>EXAM-MPTI-01</TableCell>
                <TableCell>Ujian Tengah Semester MPTI</TableCell>
                <TableCell>MPTI</TableCell>
                <TableCell>Thu Oct 17 2024 13:10:56.772</TableCell>
                <TableCell>Wed Jun 25 1975 08:30:00.000</TableCell>
                <TableCell>
                  <Button>
                    <Eye />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </Card>

      <AlertDialog open={errDialog}>
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
                setErrDialog(false)
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
  )
}
