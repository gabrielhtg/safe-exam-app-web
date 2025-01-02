import Link from 'next/link'
import { MenuIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Menu } from '@/components/admin-panel/menu'
import {
  Sheet,
  SheetHeader,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet'
import Image from 'next/image'

export function SheetMenu() {
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden" asChild>
        <Button className="h-8" variant="outline" size="icon">
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:w-72 px-3 h-full flex flex-col" side="left">
        <SheetHeader>
          <Button
            className="flex justify-center items-center pb-2 pt-1"
            variant="link"
            asChild
          >
            <Link href="/main" className="flex items-center gap-2">
              {/*<PanelsTopLeft className="w-6 h-6 mr-1" />*/}
              <Image
                className={'w-[35px] h-[35px]'}
                src={'/assets/images/logo/app-logo.png'}
                alt={'logo'}
                width={'50'}
                height={'50'}
              />
              <SheetTitle className="font-bold text-lg">HonesTest</SheetTitle>
            </Link>
          </Button>
        </SheetHeader>
        <Menu isOpen />
      </SheetContent>
    </Sheet>
  )
}
