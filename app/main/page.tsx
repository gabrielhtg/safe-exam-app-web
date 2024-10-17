import {ContentLayout} from "@/components/admin-panel/content-layout";
import {Card, CardContent} from "@/components/ui/card";
import CourseCard from "@/components/custom-component/course-card";
import Link from "next/link";
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel";

export default function MainPage() {
    const arrayCourseCard = []

    for (let i = 0; i < 10; i++) {
        arrayCourseCard.push(
            <CourseCard></CourseCard>
        )
    }

    return (
        <ContentLayout title="Dashboard">
                <Card id={'card-utama'} className={'w-full p-5'}>
                    <h2 className={'text-lg font-bold mb-5'}>Course Group</h2>

                    <div className={'flex justify-center'}>
                        <div className={'w-[calc(100%-200px)] '}>
                            <Carousel
                                opts={{
                                    align: "start",
                                }}
                                className="w-full"
                            >
                                <CarouselContent>
                                    {Array.from({length: 10}).map((_, index) => (
                                        <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/4">
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

                    {/*<div id={'tempat-card-course'} className={'flex w-full flex-wrap gap-5 justify-evenly'}>*/}
                    {/*    {arrayCourseCard}*/}
                    {/*</div>*/}

                    <div className={'w-full text-center mt-5'}>
                        <Link href={'/main/course'} className={'text-blue-500'}>See More</Link>
                    </div>
                </Card>
        </ContentLayout>
    )
}