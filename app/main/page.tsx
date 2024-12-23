'use client'

import { ContentLayout } from '@/components/admin-panel/content-layout'
import { Card } from '@/components/ui/card'
import CourseCard from '@/components/custom-component/course-card'
import CourseGroup from '@/app/main/course-group'
import RecentExam from '@/app/main/recent-exam'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function MainPage() {
  const arrayCourseCard = []
  const router = useRouter()

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.push('/')
    }
  }, [router])

  for (let i = 0; i < 10; i++) {
    arrayCourseCard.push(<CourseCard></CourseCard>)
  }

  return (
    <ContentLayout title="Dashboard">
      <Card
        id={'card-utama'}
        className={'w-full p-10 min-h-[calc(100vh-180px)]'}
      >
        <CourseGroup />
        <RecentExam />
      </Card>
    </ContentLayout>
  )
}
