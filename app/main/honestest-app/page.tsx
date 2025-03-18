'use client'

import React, { useState } from 'react'

import { ContentLayout } from '@/components/admin-panel/content-layout'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import axios from 'axios'
import { Spinner } from '@/components/custom-component/Spinner'

export default function HonestestApp() {
  const [windowsApp, setWindowsApp] = useState<File | undefined>()
  const [linuxApp, setLinuxApp] = useState<File | undefined>()
  const [showSubmitSpinnerWindows, setShowSubmitSpinnerWindows] =
    useState(false)
  const [showSubmitSpinnerLinux, setShowSubmitSpinnerLinux] = useState(false)

  const uploadWindowsApp = async () => {
    if (!windowsApp) {
      toast.error('Insert the file first!')
      return
    }

    const formData = new FormData()
    formData.append('windows_app', windowsApp)

    try {
      const submitData = await axios.post(
        `${process.env.API_URL}/download-honestest/windows`,
        formData
      )
      if (submitData.status === 200) {
        setShowSubmitSpinnerWindows(false)
        toast.success(submitData.data.message)
      }
    } catch (e: any) {
      setShowSubmitSpinnerWindows(false)
      toast.error(e.response.data.message)
    }
  }

  const uploadLinuxApp = async () => {
    if (!linuxApp) {
      toast.error('Insert the file first!')
      return
    }

    const formData = new FormData()
    formData.append('linux_app', linuxApp)

    try {
      const submitData = await axios.post(
        `${process.env.API_URL}/download-honestest/linux`,
        formData
      )
      if (submitData.status === 200) {
        setShowSubmitSpinnerLinux(false)
        toast.success(submitData.data.message)
      }
    } catch (e: any) {
      setShowSubmitSpinnerLinux(false)
      toast.error(e.response.data.message)
    }
  }

  return (
    <ContentLayout title="Profile">
      <Card
        id={'card-utama'}
        className={'w-full p-10 min-h-[calc(100vh-180px)]'}
      >
        <h3 className={'font-bold mb-5 text-2xl'}>Honestest App</h3>

        <div className={'flex gap-3'}>
          <div
            className={'border rounded-lg w-96 py-10 px-5 gap-5 flex flex-col'}
          >
            <h3 className={'font-semibold text-2xl text-center'}>
              HonesTest Linux
            </h3>

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Input
                type="file"
                id="linux-app"
                accept=".AppImage"
                onChange={(e: any) => {
                  setLinuxApp(e.target.files![0])
                }}
              />
            </div>

            <Button
              className={'mt-3'}
              onClick={() => {
                setShowSubmitSpinnerLinux(true)

                uploadLinuxApp().then()
              }}
            >
              Submit{' '}
              <Spinner
                show={showSubmitSpinnerLinux}
                className={'text-primary-foreground'}
              />
            </Button>
          </div>

          <div
            className={'border rounded-lg w-96 py-10 px-5 gap-5 flex flex-col'}
          >
            <h3 className={'font-semibold text-2xl text-center'}>
              HonesTest Windows
            </h3>

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Input
                type="file"
                id="windows-app"
                accept=".exe"
                onChange={(e: any) => {
                  setWindowsApp(e.target.files![0])
                }}
              />
            </div>

            <Button
              className={'mt-3'}
              onClick={() => {
                setShowSubmitSpinnerWindows(true)
                uploadWindowsApp().then()
              }}
            >
              Submit{' '}
              <Spinner
                show={showSubmitSpinnerWindows}
                className={'text-primary-foreground'}
              />
            </Button>
          </div>
        </div>
      </Card>
    </ContentLayout>
  )
}
