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
    
      // ✅ Add this test block here
      if (true) {
        toast({
          title: "Test",
          description: "This is a test error",
          variant: "destructive",
        })
      }
    
      const file = e.target.files[0]
      const maxSizeInMB = 1
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024
    
      setIsSelecting(true)
    
      try {
        // Check if file is PDF
        if (!file.name.endsWith(".pdf")) {
          toast({
            title: "Invalid file type",
            description: "Please upload a PDF file",
            variant: "destructive",
          })
          return
        }
    
        // Check file size
        if (file.size > maxSizeInBytes) {
          toast({
            title: "File too large",
            description: `Maximum allowed size is ${maxSizeInMB} MB`,
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
        e.target.value = ""
      }
    }
    
    

    return (
      <label className="cursor-pointer text-gray-500 hover:text-gray-700 relative">
        {isSelecting ? <Loader2 size={20} className="animate-spin" /> : <Paperclip size={20} />}
        <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} disabled={isSelecting} />
      </label>
    )
  }
