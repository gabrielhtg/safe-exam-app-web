import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Image from 'next/image'
import { apiUrl } from '@/lib/env'
import React from 'react'
import Link from 'next/link'

export default function CourseCard(props: any) {
  return (
    <Link href={`/main/course/${props.props.id}`}>
      <Card className={'w-full hover:border-blue-500'}>
        <CardHeader>
          <CardTitle>{props.props.title}</CardTitle>
          <CardDescription>{props.props.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Image
            className={'object-cover h-40 rounded-lg'}
            src={`${apiUrl}/${props.props.image}`}
            width={500}
            height={500}
            alt={'course-image'}
          />
        </CardContent>
      </Card>
    </Link>
  )
}
