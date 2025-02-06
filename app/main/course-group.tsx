'use client'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Card } from '@/components/ui/card'
import CourseCard from '@/components/custom-component/course-card'
import Link from 'next/link'
import Autoplay from 'embla-carousel-autoplay'
import * as React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { apiUrl } from '@/lib/env'
import { getBearerHeader } from '@/app/_services/getBearerHeader.service'
import { useSelector } from 'react-redux'
import { selectUser } from '@/lib/_slices/userSlice'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'

export default function CourseGroup() {
  const [courseList, setCourseList] = useState([])
  const currentUsername = useSelector(selectUser).username

  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  )

  useEffect(() => {
    const getRecentCourse = async () => {
      try {
        const getResponse = await axios.get(`${apiUrl}/course`, {
          params: {
            sortBy: 'last_access',
            order: 'desc',
            take: '10',
            uploader: currentUsername,
          },
          headers: getBearerHeader(localStorage.getItem('token')!).headers,
        })

        setCourseList(getResponse.data.data)
      } catch (err: any) {
        toast.error(err.response.data.message)
      }
    }

    getRecentCourse().then()
  }, [currentUsername])

  return (
    <>
      <h2 className={'text-lg font-bold mb-5'}>Course Group</h2>

      <div className={'flex justify-center'}>
        {courseList.length > 0 ? (
          <div className={'w-[calc(100%-100px)] '}>
            <Carousel
              opts={{
                align: 'start',
                loop: true,
              }}
              plugins={[plugin.current]}
              onMouseEnter={plugin.current.stop}
              onMouseLeave={() => plugin.current.play()}
              className="w-full"
            >
              <CarouselContent>
                {courseList.map((course, index) => (
                  <CarouselItem
                    key={index}
                    className="md:basis-1/2 lg:basis-1/3"
                  >
                    <div className="p-1 h-full">
                      <Card className={'h-full'}>
                        <CourseCard props={course}></CourseCard>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>

            <div className={'w-full text-center mt-5'}>
              <Link
                href={'/main/course'}
                className={'text-blue-500 hover:underline'}
              >
                See More
              </Link>
            </div>
          </div>
        ) : (
          <div
            className={
              'border-2 border-dotted flex items-center justify-center p-10 w-full rounded-lg h-52 flex-col gap-3'
            }
          >
            There are no courses yet.
            <Button asChild={true}>
              <Link href={'/main/course'}>
                <Plus /> Add Course
              </Link>
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
