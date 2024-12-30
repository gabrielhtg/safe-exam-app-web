import {
  Tag,
  Users,
  Settings,
  School,
  SquarePen,
  LayoutGrid,
  LucideIcon,
  CircleHelp,
  Landmark,
} from 'lucide-react'

type Submenu = {
  href: string
  label: string
  active?: boolean
}

type Menu = {
  href: string
  label: string
  active?: boolean
  icon: LucideIcon
  submenus?: Submenu[]
}

type Group = {
  groupLabel: string
  menus: Menu[]
}

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: '',
      menus: [
        {
          href: '/main',
          label: 'Dashboard',
          icon: LayoutGrid,
        },
      ],
    },
    {
      groupLabel: 'Create',
      menus: [
        {
          href: '/main/course',
          label: 'Course',
          icon: School,
        },
        {
          href: '/main/exam',
          label: 'Exam',
          icon: SquarePen,
        },
        {
          href: '/main/questions',
          label: 'Question Bank',
          icon: Landmark,
        },
      ],
    },
    {
      groupLabel: 'Settings',
      menus: [
        {
          href: '/users',
          label: 'Users',
          icon: Users,
        },
        {
          href: '/main/profile',
          label: 'Account',
          icon: Settings,
        },
      ],
    },
  ]
}
