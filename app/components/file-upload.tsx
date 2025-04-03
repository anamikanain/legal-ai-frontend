"use client"

import type React from "react"

import { useState } from "react"
import { Paperclip, Loader2 } from "lucide-react"
import { useToast } from "./ui/use-toast"

interface FileUploadProps {
  onFileProcessed: (fileName: string) => void
}

export function FileUpload({ onFileProcessed }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const file = e.target.files[0]

    // Check if file is PDF or DOCX
    if (!file.name.endsWith(".pdf") && !file.name.endsWith(".docx")) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or DOCX file",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      // For demo purposes, we'll simulate a successful upload
      // In a real app, you would send this to your API
      // const formData = new FormData()
      // formData.append("file", file)
      // const response = await fetch("/api/upload", {
      //   method: "POST",
      //   body: formData,
      // })

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate successful response
      const data = {
        message: "File processed successfully",
        documentCount: Math.floor(Math.random() * 10) + 5, // Random number between 5-15
        fileName: file.name,
      }

      toast({
        title: "File uploaded successfully",
        description: `Processed ${data.documentCount} sections from ${file.name}`,
      })

      onFileProcessed(file.name)
    } catch (error) {
      console.error("Error uploading file:", error)
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <label className="cursor-pointer text-gray-500 hover:text-gray-700 relative">
      {isUploading ? <Loader2 size={20} className="animate-spin" /> : <Paperclip size={20} />}
      <input type="file" className="hidden" accept=".docx,.pdf" onChange={handleFileChange} disabled={isUploading} />
    </label>
  )
}

