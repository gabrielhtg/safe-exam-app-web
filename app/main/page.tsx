import {ContentLayout} from "@/components/admin-panel/content-layout";
import {Card} from "@/components/ui/card";
import CourseCard from "@/components/custom-component/course-card";
import CourseGroup from "@/app/main/course-group";
import RecentExam from "@/app/main/recent-exam";

export default function MainPage() {
    const arrayCourseCard = []

    for (let i = 0; i < 10; i++) {
        arrayCourseCard.push(
            <CourseCard></CourseCard>
        )
    }

    return (
        <ContentLayout title="Dashboard">
                <Card id={'card-utama'} className={'w-full p-10'}>
                    <CourseGroup/>
                    <RecentExam/>
                </Card>
        </ContentLayout>
    )
}