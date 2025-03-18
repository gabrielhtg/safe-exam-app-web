'use client'

import { Button } from '@/components/ui/button'
import React from 'react'

export default function DownloadPage() {
  return (
    <div className={'flex items-center flex-col justify-center h-screen'}>
      <div className={'border rounded-lg w-96 py-10 px-5 flex flex-col'}>
        <h3 className={'font-semibold text-2xl text-center'}>
          Download HonesTest
        </h3>

        <Button
          className={'mt-5'}
          onClick={() => {
            window.location.href = `${process.env.API_URL}/application/honestest-windows.exe`
          }}
        >
          Download for Windows
        </Button>

        <Button
          className={'mt-5'}
          onClick={() => {
            window.location.href = `${process.env.API_URL}/application/honestest-linux.AppImage`
          }}
        >
          Download for Linux
        </Button>
      </div>
    </div>
  )
}
