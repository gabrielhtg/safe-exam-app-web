import { AxiosRequestConfig } from 'axios'

export function getBearerHeader(token: string): AxiosRequestConfig<any> {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
}
