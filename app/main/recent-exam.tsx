import Link from 'next/link'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'

export default function RecentExam() {
  return (
    <>
      <h2 className={'text-lg font-bold mt-10 mb-5'}>Recent Exam</h2>

      <div className={'flex justify-center'}>
        <div className={'border rounded-lg w-full'}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>End Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>EXAM-MPTI-01</TableCell>
                <TableCell>Ujian Tengah Semester MPTI</TableCell>
                <TableCell>MPTI</TableCell>
                <TableCell>Thu Oct 17 2024 13:10:56.772</TableCell>
                <TableCell>Wed Jun 25 1975 08:30:00.000</TableCell>
              </TableRow>

              <TableRow>
                <TableCell>EXAM-MPTI-01</TableCell>
                <TableCell>Ujian Tengah Semester MPTI</TableCell>
                <TableCell>MPTI</TableCell>
                <TableCell>Thu Oct 17 2024 13:10:56.772</TableCell>
                <TableCell>Wed Jun 25 1975 08:30:00.000</TableCell>
              </TableRow>

              <TableRow>
                <TableCell>EXAM-MPTI-01</TableCell>
                <TableCell>Ujian Tengah Semester MPTI</TableCell>
                <TableCell>MPTI</TableCell>
                <TableCell>Thu Oct 17 2024 13:10:56.772</TableCell>
                <TableCell>Wed Jun 25 1975 08:30:00.000</TableCell>
              </TableRow>

              <TableRow>
                <TableCell>EXAM-MPTI-01</TableCell>
                <TableCell>Ujian Tengah Semester MPTI</TableCell>
                <TableCell>MPTI</TableCell>
                <TableCell>Thu Oct 17 2024 13:10:56.772</TableCell>
                <TableCell>Wed Jun 25 1975 08:30:00.000</TableCell>
              </TableRow>

              <TableRow>
                <TableCell>EXAM-MPTI-01</TableCell>
                <TableCell>Ujian Tengah Semester MPTI</TableCell>
                <TableCell>MPTI</TableCell>
                <TableCell>Thu Oct 17 2024 13:10:56.772</TableCell>
                <TableCell>Wed Jun 25 1975 08:30:00.000</TableCell>
              </TableRow>

              <TableRow>
                <TableCell>EXAM-MPTI-01</TableCell>
                <TableCell>Ujian Tengah Semester MPTI</TableCell>
                <TableCell>MPTI</TableCell>
                <TableCell>Thu Oct 17 2024 13:10:56.772</TableCell>
                <TableCell>Wed Jun 25 1975 08:30:00.000</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      <div className={'w-full text-center mt-5'}>
        <Link
          href={'/app/main/course'}
          className={'text-blue-500 hover:underline'}
        >
          See More
        </Link>
      </div>
    </>
  )
}
