import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

export default function logoutService(router: AppRouterInstance) {
  router.push('/')
  localStorage.removeItem('token')
}
