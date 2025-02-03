import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function BackButton() {
  const router = useRouter()
  return (
    <Button
      onClick={() => {
        router.back()
      }}
    >
      <ArrowLeft /> Back
    </Button>
  )
}
