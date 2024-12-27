import { ContentLayout } from '@/components/admin-panel/content-layout'
import { Card } from '@/components/ui/card'

export default function ExamSimulateEndPage() {
  return (
    <ContentLayout title="Configure Exam">
      <Card
        id={'card-utama'}
        className={'w-full p-10 min-h-[calc(100vh-180px)]'}
      ></Card>
    </ContentLayout>
  )
}
