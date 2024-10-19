'use client'

import { useState } from 'react'
import Cropper from 'react-easy-crop'
import { Button } from '@/components/ui/button' // sesuaikan dengan struktur import di project Anda

export default function UploadPhotoPage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setImageSrc(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = () => {
    // Implementasi pengiriman gambar ke BE setelah cropping.
    console.log('Gambar siap dikirim ke BE dengan resolusi 1:1.')
  }

  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className="w-[400px] p-5 border rounded">
        <h1 className="text-xl text-center mb-5">Upload Profile Photo</h1>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-3"
        />

        {imageSrc && (
          <div className="relative w-full h-[300px]">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1} // Rasio 1:1
              onCropChange={setCrop}
              onZoomChange={setZoom}
            />
          </div>
        )}

        <Button onClick={handleSubmit} className="w-full mt-3">
          Save Photo
        </Button>
      </div>
    </div>
  )
}
