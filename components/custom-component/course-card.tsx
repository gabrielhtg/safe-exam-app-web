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
import TextTruncate from 'react-text-truncate'

export default function CourseCard(props: any) {
  return (
    <Link href={`/main/course/${props.props.id}`} className={'h-full'}>
      <Card className={'w-full hover:border-blue-500 h-full'}>
        <CardHeader>
          <CardTitle>{props.props.title}</CardTitle>
          <CardDescription>
            <TextTruncate
              line={1}
              element="span"
              truncateText="…"
              text={props.props.description}
              textTruncateChild={
                <Link href={`/main/course/${props.props.id}`}>See More</Link>
              }
            />
          </CardDescription>
        </CardHeader>
        <CardContent>
          {props.props.image ? (
            <Image
              className={'object-cover h-40 rounded-lg'}
              src={`${apiUrl}/${props.props.image}`}
              width={500}
              height={500}
              alt={'course-image'}
            />
          ) : (
            <Image
              className={'object-cover h-40 rounded-lg'}
              src={'https://picsum.photos/960/540'}
              width={500}
              height={500}
              alt={'course-image'}
            />
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
