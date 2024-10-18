import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {ContentLayout} from "@/components/admin-panel/content-layout";
import {FilePlus2} from "lucide-react";

export default function ExamPage() {
    return(
        <>
            <ContentLayout title="Exam">
                <Card id={'card-utama'} className={'w-full p-10'}>
                    <h1 className={'text-3xl font-bold mb-10'}>Exam List</h1>

                    <Button>
                        <FilePlus2/>
                        Create New Exam
                    </Button>
                </Card>
            </ContentLayout>

        </>
    )
}