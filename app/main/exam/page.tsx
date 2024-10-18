import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import { FilePlus2, Search } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Input } from '@/components/ui/input'

export default function ExamPage() {
  return (
    <>
      <ContentLayout title="Exam">
        <Card
          id={'card-utama'}
          className={'w-full p-10 min-h-[calc(100vh-180px)]'}
        >
          <h1 className={'text-3xl font-bold mb-10'}>Exam List</h1>

          <div id={'tempat-action'}>
            <Button>
              <FilePlus2 />
              Create New Exam
            </Button>
          </div>

          <div id={'tempat-filter'} className={'mt-3 flex w-full gap-3'}>
            <Input
              type={'text'}
              placeholder={'Search here...'}
              className={'w-sm max-w-md'}
            />
            <Button>
              <Search />
              Search
            </Button>
          </div>

          <div id={'tempat-tabel'} className={'border rounded-lg mt-3'}>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1" className={'px-3'}>
                <AccordionTrigger className={'font-bold'}>
                  Ujian Tengah Semester MPTI
                </AccordionTrigger>
                <AccordionContent>
                  Yes. It adheres to the WAI-ARIA design pattern.
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Accordion type="single" collapsible>
              <AccordionItem value="item-1" className={'px-3'}>
                <AccordionTrigger className={'font-bold'}>
                  Ujian Tengah Semester Bahasa Inggris
                </AccordionTrigger>
                <AccordionContent>
                  Yes. It adheres to the WAI-ARIA design pattern.
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Accordion type="single" collapsible>
              <AccordionItem value="item-1" className={'px-3'}>
                <AccordionTrigger className={'font-bold'}>
                  Ujian Tengah Semester Bahasa Korea
                </AccordionTrigger>
                <AccordionContent>
                  Yes. It adheres to the WAI-ARIA design pattern.
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Accordion type="single" collapsible>
              <AccordionItem value="item-1" className={'px-3'}>
                <AccordionTrigger className={'font-bold'}>
                  Ujian Tengah Semester Machine Learning
                </AccordionTrigger>
                <AccordionContent>
                  Yes. It adheres to the WAI-ARIA design pattern.
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Accordion type="single" collapsible>
              <AccordionItem value="item-1" className={'px-3'}>
                <AccordionTrigger className={'font-bold'}>
                  Ujian Tengah Semester Jaringan Komputer
                </AccordionTrigger>
                <AccordionContent>
                  Yes. It adheres to the WAI-ARIA design pattern.
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Accordion type="single" collapsible>
              <AccordionItem value="item-1" className={'px-3'}>
                <AccordionTrigger className={'font-bold'}>
                  Ujian Tengah Semester Biologi
                </AccordionTrigger>
                <AccordionContent>
                  Yes. It adheres to the WAI-ARIA design pattern.
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Accordion type="single" collapsible>
              <AccordionItem value="item-1" className={'px-3'}>
                <AccordionTrigger className={'font-bold'}>
                  Ujian Tengah Semester MPTI
                </AccordionTrigger>
                <AccordionContent>
                  Yes. It adheres to the WAI-ARIA design pattern.
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/*<Table>*/}
            {/*  <TableHeader>*/}
            {/*    <TableRow>*/}
            {/*      <TableHead>ID</TableHead>*/}
            {/*      <TableHead>Name</TableHead>*/}
            {/*      <TableHead>Course</TableHead>*/}
            {/*      <TableHead>Start Time</TableHead>*/}
            {/*      <TableHead>End Time</TableHead>*/}
            {/*    </TableRow>*/}
            {/*  </TableHeader>*/}
            {/*  <TableBody>*/}
            {/*    <TableRow>*/}
            {/*      <TableCell>EXAM-MPTI-01</TableCell>*/}
            {/*      <TableCell>Ujian Tengah Semester MPTI</TableCell>*/}
            {/*      <TableCell>MPTI</TableCell>*/}
            {/*      <TableCell>Thu Oct 17 2024 13:10:56.772</TableCell>*/}
            {/*      <TableCell>Wed Jun 25 1975 08:30:00.000</TableCell>*/}
            {/*    </TableRow>*/}

            {/*    <TableRow>*/}
            {/*      <TableCell>EXAM-MPTI-01</TableCell>*/}
            {/*      <TableCell>Ujian Tengah Semester MPTI</TableCell>*/}
            {/*      <TableCell>MPTI</TableCell>*/}
            {/*      <TableCell>Thu Oct 17 2024 13:10:56.772</TableCell>*/}
            {/*      <TableCell>Wed Jun 25 1975 08:30:00.000</TableCell>*/}
            {/*    </TableRow>*/}

            {/*    <TableRow>*/}
            {/*      <TableCell>EXAM-MPTI-01</TableCell>*/}
            {/*      <TableCell>Ujian Tengah Semester MPTI</TableCell>*/}
            {/*      <TableCell>MPTI</TableCell>*/}
            {/*      <TableCell>Thu Oct 17 2024 13:10:56.772</TableCell>*/}
            {/*      <TableCell>Wed Jun 25 1975 08:30:00.000</TableCell>*/}
            {/*    </TableRow>*/}

            {/*    <TableRow>*/}
            {/*      <TableCell>EXAM-MPTI-01</TableCell>*/}
            {/*      <TableCell>Ujian Tengah Semester MPTI</TableCell>*/}
            {/*      <TableCell>MPTI</TableCell>*/}
            {/*      <TableCell>Thu Oct 17 2024 13:10:56.772</TableCell>*/}
            {/*      <TableCell>Wed Jun 25 1975 08:30:00.000</TableCell>*/}
            {/*    </TableRow>*/}

            {/*    <TableRow>*/}
            {/*      <TableCell>EXAM-MPTI-01</TableCell>*/}
            {/*      <TableCell>Ujian Tengah Semester MPTI</TableCell>*/}
            {/*      <TableCell>MPTI</TableCell>*/}
            {/*      <TableCell>Thu Oct 17 2024 13:10:56.772</TableCell>*/}
            {/*      <TableCell>Wed Jun 25 1975 08:30:00.000</TableCell>*/}
            {/*    </TableRow>*/}

            {/*    <TableRow>*/}
            {/*      <TableCell>EXAM-MPTI-01</TableCell>*/}
            {/*      <TableCell>Ujian Tengah Semester MPTI</TableCell>*/}
            {/*      <TableCell>MPTI</TableCell>*/}
            {/*      <TableCell>Thu Oct 17 2024 13:10:56.772</TableCell>*/}
            {/*      <TableCell>Wed Jun 25 1975 08:30:00.000</TableCell>*/}
            {/*    </TableRow>*/}
            {/*  </TableBody>*/}
            {/*</Table>*/}
          </div>
        </Card>
      </ContentLayout>
    </>
  )
}
