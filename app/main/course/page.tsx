'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  CircleCheck,
  CircleX,
  Eye,
  ImagePlus,
  Inbox,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
} from 'lucide-react'
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
import { Input } from '@/components/ui/input'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import axios from 'axios'
import { apiUrl, compressOptions } from '@/lib/env'
import imageCompression from 'browser-image-compression'
import { useSelector } from 'react-redux'
import { selectUser } from '@/lib/_slices/userSlice'

export default function CoursePage() {
  const [dialogMsg, setDialogMsg] = useState('')
  const [errDialog, setErrDialog] = useState(false)
  const [dialogType, setDialogType] = useState(1)
  const [isLoadingCreate, setIsLoadingCreate] = useState(false)

  const [courseImage, setCourseImage] = useState('')
  const [courseImageFile, setCourseImageFile] = useState<File | undefined>()
  const [courseTitle, setCourseTitle] = useState('')
  const [courseDesc, setCourseDesc] = useState('')
  const currentUsername = useSelector(selectUser).username
  const [courseList, setCourseList] = useState([])

  const getAllCourse = async () => {
    const response = await axios.get(`${apiUrl}/course`)

    setCourseList(response.data.data)
  }

  useEffect(() => {
    getAllCourse().then()
  }, [])

  const handleAddCourse = async () => {
    setIsLoadingCreate(true)
    const formData = new FormData()
    formData.append('title', courseTitle)
    formData.append('description', courseDesc)
    formData.append('username', currentUsername)

    try {
      const compressedImage = await imageCompression(
        courseImageFile!,
        compressOptions
      )

      formData.append('course_pict', compressedImage)

      const response = await axios.post(`${apiUrl}/course`, formData)

      if (response.status === 200) {
        getAllCourse().then()
        setErrDialog(true)
        setDialogType(1)
        setDialogMsg(response.data.message)
        setIsLoadingCreate(false)
      }
    } catch (err: any) {
      setErrDialog(true)
      setDialogType(0)
      setDialogMsg(err.response.data.message)
      setIsLoadingCreate(false)
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

  return (
    <ContentLayout title="Profile">
      <Card
        id={'card-utama'}
        className={
          'flex flex-col gap-3 md:gap-5 p-10 min-h-[calc(100vh-180px)] rounded-lg shadow'
        }
      >
        <h2 className={'text-2xl font-bold mb-3'}>Course</h2>

        <div className={'flex'}>
          <AlertDialog>
            <AlertDialogTrigger>
              <Button>
                <Plus />
                Add Course
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Add Course</AlertDialogTitle>
                <AlertDialogDescription className={'flex flex-col gap-5 mt-3'}>
                  <div className="grid w-full items-center gap-1.5 mt-3">
                    <Label htmlFor="course-title">Course Title</Label>
                    <Input
                      type="text"
                      id="course-title"
                      onChange={(e) => {
                        setCourseTitle(e.target.value)
                      }}
                    />
                  </div>

                  <div className="grid w-full items-center gap-1.5 ">
                    <Label htmlFor="course-desc">Course Description</Label>
                    <Textarea
                      id="course-desc"
                      onChange={(e) => {
                        setCourseDesc(e.target.value)
                      }}
                    />
                  </div>

                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="course-image">Course Image</Label>

                    {courseImage == '' ? (
                      <Skeleton
                        className={
                          'w-full h-48 flex items-center justify-center'
                        }
                      >
                        <ImagePlus />
                      </Skeleton>
                    ) : (
                      <Image
                        src={courseImage}
                        width={500}
                        height={500}
                        alt={'course-image'}
                        className={'w-full h-48 object-cover'}
                      />
                    )}

                    <Input
                      type="file"
                      id="course-image"
                      onChange={(e) => {
                        setCourseImage(URL.createObjectURL(e.target.files![0]))
                        setCourseImageFile(e.target.files![0])
                      }}
                    />
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleAddCourse}>
                  Save
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className={'flex gap-3'}>
          <Input
            type={'text'}
            className={'max-w-lg'}
            placeholder={'Search here...'}
          />

          <Button>
            <Search /> Search
          </Button>
        </div>

        {courseList.length === 0 ? ( // Gunakan triple equals (===) untuk perbandingan
          <div className="flex flex-col w-full h-96 justify-center items-center">
            <Inbox className="w-20 h-20" />
            There are no courses yet!
          </div>
        ) : (
          <div className="grid md:grid-cols-3 xl:grid-cols-4 gap-4">
            {courseList.map((course: any, index: number) => (
              <Card className={'w-full'} key={index}>
                <CardHeader>
                  <CardTitle>{course.title}</CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Image
                    className={'object-cover h-40 rounded-lg'}
                    src={`${apiUrl}/${course.image}`}
                    width={500}
                    height={500}
                    alt={'course-image'}
                  />
                </CardContent>
                <CardFooter className={'flex gap-2'}>
                  <Button>
                    <Eye />
                  </Button>
                  <Button>
                    <Pencil />
                  </Button>
                  <Button variant={'destructive'}>
                    <Trash2 />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
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
              Creating New Course
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
