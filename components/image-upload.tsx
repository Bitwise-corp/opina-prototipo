"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Camera, X, Upload } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  maxImages?: number
  onChange: (images: string[]) => void
  value?: string[]
}

export function ImageUpload({ maxImages = 5, onChange, value = [] }: ImageUploadProps) {
  const [images, setImages] = useState<string[]>(value)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newImages: string[] = []
    const filesToProcess = Math.min(files.length, maxImages - images.length)

    for (let i = 0; i < filesToProcess; i++) {
      const file = files[i]
      const reader = new FileReader()

      reader.onload = (event) => {
        if (event.target?.result) {
          const imageDataUrl = event.target.result.toString()
          newImages.push(imageDataUrl)

          // When all files are processed, update state
          if (newImages.length === filesToProcess) {
            const updatedImages = [...images, ...newImages]
            setImages(updatedImages)
            onChange(updatedImages)
          }
        }
      }

      reader.readAsDataURL(file)
    }

    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index)
    setImages(updatedImages)
    onChange(updatedImages)
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden border border-gray-200"
          >
            <Image
              src={image || "/placeholder.svg"}
              alt={`Uploaded image ${index + 1}`}
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-1 right-1 bg-black/70 rounded-full p-1 text-white hover:bg-black"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}

        {images.length < maxImages && (
          <button
            type="button"
            onClick={triggerFileInput}
            className="w-24 h-24 sm:w-32 sm:h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors"
          >
            <Upload className="w-6 h-6 mb-1" />
            <span className="text-xs">Adicionar</span>
          </button>
        )}
      </div>

      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" multiple className="hidden" />

      <Button
        type="button"
        variant="outline"
        onClick={triggerFileInput}
        disabled={images.length >= maxImages}
        className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
      >
        <Camera className="w-4 h-4 mr-2" />
        {images.length === 0 ? "Adicionar Fotos" : "Adicionar Mais Fotos"}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        {images.length} de {maxImages} imagens
      </p>
    </div>
  )
}
