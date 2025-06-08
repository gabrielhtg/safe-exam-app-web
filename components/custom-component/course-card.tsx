import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Image from 'next/image'
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
              src={`${process.env.API_URL}/${props.props.image}`}
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
                className={
                  'font-bold text-muted-foreground text-2xl text-center'
                }
              >
                {props.props.title}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
