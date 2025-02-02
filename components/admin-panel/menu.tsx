'use client'

import { Ellipsis, LogOut } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'

import { cn } from '@/lib/utils'
import { getMenuList } from '@/lib/menu-list'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { CollapseMenuButton } from '@/components/admin-panel/collapse-menu-button'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip'
import logoutService from '@/app/_services/logout.service'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { apiUrl } from '@/lib/env'
import { getBearerHeader } from '@/app/_services/getBearerHeader.service'
import Link from 'next/link'

interface MenuProps {
  isOpen: boolean | undefined
}

export function Menu({ isOpen }: MenuProps) {
  const pathname = usePathname()
  const menuList = getMenuList(pathname)
  const router = useRouter()
  const [userData, setUserData] = useState<any>()

  const handleLogout = () => {
    logoutService(router)
  }

  const handleGetUser = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/users/${localStorage.getItem('username')}`,
        getBearerHeader(localStorage.getItem('token')!)
      )

      setUserData(response.data.data)
    } catch (e: any) {
      if (e.response && e.response.status === 401) {
        router.push('/')
      }
    }
  }

  useEffect(() => {
    handleGetUser().then()
  }, [])

  return (
    <ScrollArea className="[&>div>div[style]]:!block">
      <nav className="mt-8 w-full">
        <ul className="flex flex-col min-h-[calc(100vh-48px-36px-16px-32px)] lg:min-h-[calc(100vh-32px-40px-50px)] items-start space-y-1 px-2">
          {menuList.map(({ groupLabel, menus }, groupIndex) => (
            <li
              className={cn('w-full', groupLabel ? 'pt-5' : '')}
              key={groupIndex}
            >
              {(isOpen && groupLabel) || isOpen === undefined ? (
                <p className="text-sm font-medium text-muted-foreground px-4 pb-2 max-w-[248px] truncate">
                  {groupLabel}
                </p>
              ) : !isOpen && true && groupLabel ? (
                <TooltipProvider>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger className="w-full">
                      <div className="w-full flex justify-center items-center">
                        <Ellipsis className="h-5 w-5" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{groupLabel}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <p className="pb-2"></p>
              )}
              {menus.map(
                ({ href, label, icon: Icon, active, submenus }, menuIndex) =>
                  !submenus || submenus.length === 0 ? (
                    <>
                      {userData?.role === 'ADMIN' ? (
                        <div className="w-full" key={menuIndex}>
                          <TooltipProvider disableHoverableContent>
                            <Tooltip delayDuration={100}>
                              <TooltipTrigger asChild>
                                <Button
                                  variant={
                                    (active === undefined &&
                                      href.includes(pathname.split('/')[2]) &&
                                      href.split('/').length > 1) ||
                                    (active === undefined &&
                                      pathname === href &&
                                      href.split('/').length == 2) ||
                                    active
                                      ? 'secondary'
                                      : 'ghost'
                                  }
                                  className="w-full justify-start h-10 mb-1"
                                  asChild
                                >
                                  <Link href={href}>
                                    <span
                                      className={cn(
                                        isOpen === false ? '' : 'mr-4'
                                      )}
                                    >
                                      <Icon size={18} />
                                    </span>
                                    <p
                                      className={cn(
                                        'max-w-[200px] truncate',
                                        isOpen === false
                                          ? '-translate-x-96 opacity-0'
                                          : 'translate-x-0 opacity-100'
                                      )}
                                    >
                                      {label}
                                    </p>
                                  </Link>
                                </Button>
                              </TooltipTrigger>
                              {isOpen === false && (
                                <TooltipContent side="right">
                                  {label}
                                </TooltipContent>
                              )}
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      ) : (
                        <>
                          {label !== 'Users' ? (
                            <div className="w-full" key={menuIndex}>
                              <TooltipProvider disableHoverableContent>
                                <Tooltip delayDuration={100}>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant={
                                        (active === undefined &&
                                          href.includes(
                                            pathname.split('/')[2]
                                          ) &&
                                          href.split('/').length > 1) ||
                                        (active === undefined &&
                                          pathname === href &&
                                          href.split('/').length == 2) ||
                                        active
                                          ? 'secondary'
                                          : 'ghost'
                                      }
                                      className="w-full justify-start h-10 mb-1"
                                      asChild
                                    >
                                      <Link href={href}>
                                        <span
                                          className={cn(
                                            isOpen === false ? '' : 'mr-4'
                                          )}
                                        >
                                          <Icon size={18} />
                                        </span>
                                        <p
                                          className={cn(
                                            'max-w-[200px] truncate',
                                            isOpen === false
                                              ? '-translate-x-96 opacity-0'
                                              : 'translate-x-0 opacity-100'
                                          )}
                                        >
                                          {label}
                                        </p>
                                      </Link>
                                    </Button>
                                  </TooltipTrigger>
                                  {isOpen === false && (
                                    <TooltipContent side="right">
                                      {label}
                                    </TooltipContent>
                                  )}
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          ) : (
                            ''
                          )}
                        </>
                      )}
                    </>
                  ) : (
                    <div className="w-full" key={menuIndex}>
                      <CollapseMenuButton
                        icon={Icon}
                        label={label}
                        active={
                          active === undefined
                            ? pathname.includes(href)
                            : active
                        }
                        submenus={submenus}
                        isOpen={isOpen}
                      />
                    </div>
                  )
              )}
            </li>
          ))}
          <li className="w-full grow flex items-end">
            <TooltipProvider disableHoverableContent>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="w-full justify-center h-10 mt-5"
                  >
                    <span className={cn(isOpen === false ? '' : 'mr-4')}>
                      <LogOut size={18} />
                    </span>
                    <p
                      className={cn(
                        'whitespace-nowrap',
                        isOpen === false ? 'opacity-0 hidden' : 'opacity-100'
                      )}
                    >
                      Sign out
                    </p>
                  </Button>
                </TooltipTrigger>
                {isOpen === false && (
                  <TooltipContent side="right" onClick={handleLogout}>
                    Sign out
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </li>
        </ul>
      </nav>
    </ScrollArea>
  )
}
