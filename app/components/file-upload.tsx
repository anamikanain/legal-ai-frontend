"use client"

import type React from "react"
import { useState } from "react"
import { Paperclip, Loader2 } from "lucide-react"
import { useToast } from "./ui/use-toast"

interface FileUploadProps {
  onFileSelected: (file: File) => void
}

export function FileUpload({ onFileSelected }: FileUploadProps) {
  const [isSelecting, setIsSelecting] = useState(false)
  const { toast } = useToast()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
  
    const file = e.target.files[0]
    setIsSelecting(true)
  
    try {
      // Check if file is PDF or DOCX
      if (!file.name.endsWith(".pdf") && !file.name.endsWith(".docx")) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF or DOCX file",
          variant: "destructive",
        })
        return
      }
  
      onFileSelected(file)
    } catch (error) {
      console.error("Error processing file:", error)
      toast({
        title: "File processing failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSelecting(false)
      // Reset the file input so the same file can be selected again
      e.target.value = ""
    }
  }
  

  return (
    <label className="cursor-pointer text-gray-500 hover:text-gray-700 relative">
      {isSelecting ? <Loader2 size={20} className="animate-spin" /> : <Paperclip size={20} />}
      <input type="file" className="hidden" accept=".docx,.pdf" onChange={handleFileChange} disabled={isSelecting} />
    </label>
  )
}
