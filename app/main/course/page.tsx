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
  Pencil,
  Plus,
  Search,
  Trash2,
  Turtle,
  Cat,
  Dog,
  Rabbit,
  Fish,
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
import React, { useState } from 'react'
import Image from 'next/image'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'

export default function CoursePage() {
  const [dialogMsg, setDialogMsg] = useState('')
  const [errDialog, setErrDialog] = useState(false)
  const [dialogType, setDialogType] = useState(1)

  const [courseImage, setCourseImage] = useState('')
  const handleAddCourse = async () => {}

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
                    <Input type="text" id="course-title" />
                  </div>

                  <div className="grid w-full items-center gap-1.5 ">
                    <Label htmlFor="course-desc">Course Description</Label>
                    <Textarea id="course-desc" />
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
                        alt={'course-image'}
                        className={'w-full h-48'}
                      />
                    )}

                    <Input type="file" id="course-image" />
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

        <div className="grid grid-cols-4 gap-4">
          <Card className={'w-full'}>
            <CardHeader>
              <CardTitle>MPTI</CardTitle>
              <CardDescription>
                Manajemen Proyek Teknologi Informasi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Image
                className={'object-cover h-40 rounded-lg'}
                src={
                  'http://localhost:3001/profile_pict/profile_pict-1733731398131-397516538.jpg'
                }
                width={500}
                height={500}
                alt={'bg'}
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

          <Card className={'w-full'}>
            <CardHeader>
              <CardTitle>MPTI</CardTitle>
              <CardDescription>
                Manajemen Proyek Teknologi Informasi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Image
                className={'object-cover h-40 rounded-lg'}
                src={
                  'http://localhost:3001/profile_pict/profile_pict-1733731398131-397516538.jpg'
                }
                width={500}
                height={500}
                alt={'bg'}
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

          <Card className={'w-full'}>
            <CardHeader>
              <CardTitle>MPTI</CardTitle>
              <CardDescription>
                Manajemen Proyek Teknologi Informasi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Image
                className={'object-cover h-40 rounded-lg'}
                src={
                  'http://localhost:3001/profile_pict/profile_pict-1733731398131-397516538.jpg'
                }
                width={500}
                height={500}
                alt={'bg'}
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

          <Card className={'w-full'}>
            <CardHeader>
              <CardTitle>MPTI</CardTitle>
              <CardDescription>
                Manajemen Proyek Teknologi Informasi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Image
                className={'object-cover h-40 rounded-lg'}
                src={
                  'http://localhost:3001/profile_pict/profile_pict-1733731398131-397516538.jpg'
                }
                width={500}
                height={500}
                alt={'bg'}
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

          <Card className={'w-full'}>
            <CardHeader>
              <CardTitle>MPTI</CardTitle>
              <CardDescription>
                Manajemen Proyek Teknologi Informasi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Image
                className={'object-cover h-40 rounded-lg'}
                src={
                  'http://localhost:3001/profile_pict/profile_pict-1733731398131-397516538.jpg'
                }
                width={500}
                height={500}
                alt={'bg'}
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

          <Card className={'w-full'}>
            <CardHeader>
              <CardTitle>MPTI</CardTitle>
              <CardDescription>
                Manajemen Proyek Teknologi Informasi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Image
                className={'object-cover h-40 rounded-lg'}
                src={
                  'http://localhost:3001/profile_pict/profile_pict-1733731398131-397516538.jpg'
                }
                width={500}
                height={500}
                alt={'bg'}
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

          <Card className={'w-full'}>
            <CardHeader>
              <CardTitle>MPTI</CardTitle>
              <CardDescription>
                Manajemen Proyek Teknologi Informasi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Image
                className={'object-cover h-40 rounded-lg'}
                src={
                  'http://localhost:3001/profile_pict/profile_pict-1733731398131-397516538.jpg'
                }
                width={500}
                height={500}
                alt={'bg'}
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
    </ContentLayout>
  )
}
