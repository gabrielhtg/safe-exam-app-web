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
  CircleX,
  Eye,
  ImagePlus,
  Inbox,
  Loader2,
  Pencil,
  Plus,
  RefreshCcw,
  Search,
  Trash2,
  UserCog,
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
import { getBearerHeader } from '@/app/_services/getBearerHeader.service'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import TextTruncate from 'react-text-truncate'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export default function CoursePage() {
  const [addDialog, setAddDialog] = useState(false)
  const [isLoadingCreate, setIsLoadingCreate] = useState(false)

  const [courseImage, setCourseImage] = useState('')
  const [courseImageFile, setCourseImageFile] = useState<File | undefined>()
  const [courseTitle, setCourseTitle] = useState('')
  const [courseDesc, setCourseDesc] = useState('')
  const [courseTitleErr, setCourseTitleErr] = useState('')
  const [courseDescErr, setCourseDescErr] = useState('')
  const [courseImageErr, setCourseImageErr] = useState('')
  const [courseList, setCourseList] = useState([])
  const [loadingTitle, setLoadingTitle] = useState('')
  const [searchKeywords, setSearchKeywords] = useState('')

  const router = useRouter()

  const getAllCourse = async () => {
    const response = await axios.get(`${apiUrl}/course`, {
      params: {
        uploader: localStorage.getItem('username'),
      },
      headers: getBearerHeader(localStorage.getItem('token')!).headers,
    })

    setCourseList(response.data.data)
  }

  const searchCourse = async (keywords: string | undefined) => {
    const response = await axios.get(`${apiUrl}/course`, {
      headers: getBearerHeader(localStorage.getItem('token')!).headers,
      params: {
        search: keywords,
      },
    })

    setCourseList(response.data.data)
  }

  useEffect(() => {
    getAllCourse().then()
  }, [])

  const handleRemoveCourse = async (title: string) => {
    try {
      const removeResponse = await axios.delete(
        `${apiUrl}/course/${title}`,
        getBearerHeader(localStorage.getItem('token')!)
      )

      toast.success(removeResponse.data.message)
      getAllCourse().then()
    } catch (err: any) {
      toast.error(err.response.data.message)
      getAllCourse().then()
    }
  }

  const handleAddCourse = async () => {
    setIsLoadingCreate(true)
    setLoadingTitle('Creating New Course')
    const formData = new FormData()
    formData.append('title', courseTitle)
    formData.append('description', courseDesc)
    formData.append('username', localStorage.getItem('username')!)

    try {
      if (courseImageFile) {
        const compressedImage = await imageCompression(
          courseImageFile!,
          compressOptions
        )

        formData.append('course_pict', compressedImage)
      }

      const response = await axios.post(
        `${apiUrl}/course`,
        formData,
        getBearerHeader(localStorage.getItem('token')!)
      )

      if (response.status === 200) {
        getAllCourse().then()
        toast.success(response.data.message)
        setIsLoadingCreate(false)
      }
    } catch (err: any) {
      toast.error(err.response.data.message)
      setIsLoadingCreate(false)
    }

    setCourseImage('')
    setCourseImageFile(undefined)
    setAddDialog(false)
    setCourseTitle('')
    setCourseDesc('')
  }

  const handleEditCourse = async (id: string) => {
    setIsLoadingCreate(true)
    setLoadingTitle('Updating Course')
    const formData = new FormData()
    formData.append('title', courseTitle)
    formData.append('description', courseDesc)
    formData.append('username', localStorage.getItem('username')!)
    formData.append('id', id)

    try {
      if (courseImageFile) {
        const compressedImage = await imageCompression(
          courseImageFile!,
          compressOptions
        )

        formData.append('course_pict', compressedImage)
      }

      const response = await axios.patch(
        `${apiUrl}/course`,
        formData,
        getBearerHeader(localStorage.getItem('token')!)
      )

      if (response.status === 200) {
        getAllCourse().then()
        toast.success(response.data.message)
        setIsLoadingCreate(false)
      }
    } catch (err: any) {
      toast.error(err.response.data.message)
      setIsLoadingCreate(false)
    }

    setCourseImage('')
    setCourseImageFile(undefined)
    setCourseTitle('')
    setCourseDesc('')
  }

  return (
    <ContentLayout title="Course">
      <Card
        id={'card-utama'}
        className={
          'flex flex-col gap-3 md:gap-5 p-10 min-h-[calc(100vh-180px)] rounded-lg shadow'
        }
      >
        <h1 className={'font-semibold text-3xl'}>Course List</h1>

        <div className={'flex gap-3'}>
          <Input
            type={'text'}
            className={'max-w-lg'}
            value={searchKeywords}
            placeholder={'Search here...'}
            onChange={(e) => {
              setSearchKeywords(e.target.value)
            }}
          />

          <Button
            onClick={() => {
              searchCourse(searchKeywords!)
            }}
          >
            <Search /> Search
          </Button>

          {searchKeywords !== '' ? (
            <Button
              onClick={() => {
                setSearchKeywords('')
                searchCourse(undefined)
              }}
            >
              <CircleX /> Clear
            </Button>
          ) : (
            ''
          )}

          <AlertDialog open={addDialog} onOpenChange={setAddDialog}>
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
                      value={courseTitle}
                      onChange={(e) => {
                        setCourseTitle(e.target.value)
                      }}
                    />
                    <span className={'text-sm text-red-500'}>
                      {courseTitleErr}
                    </span>
                  </div>

                  <div className="grid w-full items-center gap-1.5 ">
                    <Label htmlFor="course-desc">Course Description</Label>
                    <Textarea
                      value={courseDesc}
                      id="course-desc"
                      onChange={(e) => {
                        setCourseDesc(e.target.value)
                      }}
                    />
                    <span className={'text-sm text-red-500'}>
                      {courseDescErr}
                    </span>
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
                      accept="image/jpeg, image/png"
                      onChange={(e) => {
                        setCourseImageErr('')
                        const file = e.target.files?.[0] // Ambil file pertama yang diunggah
                        if (file) {
                          if (
                            file.type === 'image/jpeg' ||
                            file.type === 'image/png'
                          ) {
                            setCourseImage(URL.createObjectURL(file))
                            setCourseImageFile(file)
                          } else {
                            setCourseImageErr(
                              'Only JPEG or PNG files are allowed!'
                            )
                            e.target.value = '' // Reset input file
                          }
                        }
                      }}
                    />
                    <span className={'text-sm text-red-500'}>
                      {courseImageErr}
                    </span>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  onClick={() => {
                    setCourseDesc('')
                    setCourseTitleErr('')
                    setCourseDescErr('')
                    setCourseImageErr('')
                    setCourseTitle('')
                    setCourseImage('')
                    setCourseImageFile(undefined)
                  }}
                >
                  Cancel
                </AlertDialogCancel>
                <Button
                  onClick={() => {
                    if (courseTitle === '') {
                      setCourseTitleErr('Cannot be blank!')
                    }

                    if (courseDesc === '') {
                      setCourseDescErr('Cannot be blank!')
                    }

                    if (courseTitle !== '' && courseDesc !== '') {
                      handleAddCourse().then()
                    }
                  }}
                >
                  Save
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button
            onClick={() => {
              getAllCourse().then()
              toast.success('Course refreshed!')
            }}
          >
            <RefreshCcw /> Refresh
          </Button>
        </div>

        {courseList.length === 0 ? ( // Gunakan triple equals (===) untuk perbandingan
          <div className="flex flex-col w-full h-96 justify-center items-center gap-3">
            <Inbox className="w-20 h-20" />
            There are no courses!
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {courseList.map((course: any, index: number) => (
              <Card className={'w-full'} key={index}>
                <CardHeader>
                  <CardTitle>{course.title}</CardTitle>
                  <CardDescription>
                    <TextTruncate
                      line={1}
                      element="span"
                      truncateText="…"
                      text={course.description}
                      textTruncateChild={
                        <Link href={`/main/course/${course.id}`}>See More</Link>
                      }
                    />
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {course.image ? (
                    <Image
                      className={'object-cover h-40 rounded-lg'}
                      src={`${apiUrl}/${course.image}`}
                      width={500}
                      height={500}
                      alt={'course-image'}
                    />
                  ) : (
                    <div
                      className={
                        'w-full h-40 flex items-center justify-center bg-muted rounded-lg'
                      }
                    >
                      <span
                        className={'font-bold text-muted-foreground text-2xl'}
                      >
                        {course.title}
                      </span>
                    </div>
                  )}
                </CardContent>
                <CardFooter className={'flex gap-2'}>
                  <Button asChild={true}>
                    <Link href={`/main/course/${course.id}`}>
                      <Eye />
                    </Link>
                  </Button>

                  {/*Bagian Edit Dialog*/}
                  <AlertDialog>
                    <AlertDialogTrigger
                      onClick={() => {
                        setCourseTitle(course.title)
                        setCourseDesc(course.description)
                        setCourseImage(`${apiUrl}/${course.image}`)
                      }}
                    >
                      <Button>
                        <Pencil />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Edit Course</AlertDialogTitle>
                        <AlertDialogDescription
                          className={'flex flex-col gap-5 mt-3'}
                        >
                          <div className="grid w-full items-center gap-1.5 mt-3">
                            <Label htmlFor="course-title-update">
                              Course Title
                            </Label>
                            <Input
                              type="text"
                              id="course-title-update"
                              value={courseTitle}
                              onChange={(e) => {
                                setCourseTitle(e.target.value)
                              }}
                            />
                            <span className={'text-sm text-red-500'}>
                              {courseTitleErr}
                            </span>
                          </div>

                          <div className="grid w-full items-center gap-1.5 ">
                            <Label htmlFor="course-desc-update">
                              Course Description
                            </Label>
                            <Textarea
                              id="course-desc-update"
                              value={courseDesc}
                              onChange={(e) => {
                                setCourseDesc(e.target.value)
                              }}
                            />
                            <span className={'text-sm text-red-500'}>
                              {courseDescErr}
                            </span>
                          </div>

                          <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="course-image">Course Image</Label>

                            {course.image == null &&
                            courseImageFile === undefined ? (
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
                              accept="image/jpeg, image/png"
                              onChange={(e) => {
                                setCourseImage(
                                  URL.createObjectURL(e.target.files![0])
                                )
                                setCourseImageFile(e.target.files![0])
                              }}
                            />

                            <span className={'text-sm text-red-500'}>
                              {courseImageErr}
                            </span>
                          </div>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel
                          onClick={() => {
                            setCourseDesc('')
                            setCourseTitleErr('')
                            setCourseDescErr('')
                            setCourseImageErr('')
                            setCourseTitle('')
                            setCourseImage('')
                            setCourseImageFile(undefined)
                          }}
                        >
                          Cancel
                        </AlertDialogCancel>
                        <Button
                          onClick={() => {
                            if (courseTitle === '') {
                              setCourseTitleErr('Cannot be blank!')
                            }

                            if (courseDesc === '') {
                              setCourseDescErr('Cannot be blank!')
                            }

                            if (courseTitle !== '' && courseDesc !== '') {
                              handleEditCourse(`${course.id}`).then()
                            }
                          }}
                        >
                          Save
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <Button
                    onClick={() => {
                      router.push(`/main/course/manage-access/${course.id}`)
                    }}
                  >
                    <UserCog />
                  </Button>

                  {/*Bagian Delete Dialog*/}
                  <AlertDialog>
                    <AlertDialogTrigger>
                      <Button variant={'destructive'}>
                        <Trash2 />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Course</AlertDialogTitle>
                        <AlertDialogDescription
                          className={'flex flex-col gap-5 mt-3'}
                        >
                          <p>Are you sure to delete {course.title} course?</p>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            handleRemoveCourse(course.id).then()
                          }}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </Card>

      <Dialog open={isLoadingCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className={'text-center flex flex-col items-center'}>
              {loadingTitle}
            </DialogTitle>
            <DialogDescription className={'flex w-full justify-center mt-3'}>
              <Loader2 className="animate-spin w-10 h-10" />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </ContentLayout>
  )
}
