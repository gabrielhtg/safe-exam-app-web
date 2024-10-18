'use client'

import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel";
import {Card} from "@/components/ui/card";
import CourseCard from "@/components/custom-component/course-card";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import * as React from "react";

export default function CourseGroup() {
    const plugin = React.useRef(
        Autoplay({ delay: 2000, stopOnInteraction: true })
    )

    return (
        <>
            <h2 className={'text-lg font-bold mb-5'}>Course Group</h2>

            <div className={'flex justify-center'}>
                <div className={'w-[calc(100%-100px)] '}>
                    <Carousel
                        opts={{
                            align: "start",
                            loop: true,

                        }}
                        plugins={[
                            plugin.current
                        ]}
                        onMouseEnter={plugin.current.stop}

                        onMouseLeave={() => plugin.current.play()}

                        className="w-full"
                    >
                        <CarouselContent>
                            {Array.from({length: 10}).map((_, index) => (
                                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                                    <div className="p-1">
                                        <Card>
                                            <CourseCard></CourseCard>
                                        </Card>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious/>
                        <CarouselNext/>
                    </Carousel>
                </div>
            </div>

            <div className={'w-full text-center mt-5'}>
                <Link href={'/main/course'} className={'text-blue-500 hover:underline'}>See More</Link>
            </div>
        </>
    )
}