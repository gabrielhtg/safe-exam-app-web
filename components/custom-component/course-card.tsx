import {Card} from "@/components/ui/card";
import Image from "next/image";
import {Skeleton} from "@/components/ui/skeleton";

export default function CourseCard () {
    return (
        <Card className={'w-full p-3 border-none'}>
            {/*<Image src={} alt={}/>*/}

            <Skeleton className={'w-full h-[120px] rounded-xl'}/>

            <Skeleton className={'w-full h-[20px] rounded-xl mt-3'}/>
            <Skeleton className={'w-4/6 h-[20px] rounded-xl mt-3'}/>
        </Card>
    )
}