"use client"
import { useState } from "react"
import { Send } from "lucide-react"
import { FileUpload } from "./file-upload"
import { useToast } from "./ui/use-toast"
import axios from "axios"
import { FileText } from "lucide-react"

interface MessageInputProps {
  onSendMessage: (message: string) => void
  onAIResponse: (response: string) => void
  setIsLoading: (loading: boolean) => void
}

export function MessageInput({ onSendMessage, onAIResponse, setIsLoading }: MessageInputProps) {
  const [message, setMessage] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [uploadedFileNames, setUploadedFileNames] = useState<string[]>([])
  const [isQuerying, setIsQuerying] = useState(false)
  const { toast } = useToast()

  const handleSendMessage = async () => {
    if (!message.trim() && uploadedFiles.length === 0) return

    // First send the message to the UI
    onSendMessage(message || uploadedFileNames.join(", "))
    const currentMessage = message
    setMessage("")
    setIsQuerying(true)
    setIsLoading(true)

    try {
      let response

      // If we have files to upload
      if (uploadedFiles.length > 0) {
        const formData = new FormData()
        uploadedFiles.forEach((file) => {
          // formData.append("document", file)
          formData.append("document", uploadedFiles[0])
        })

        // Add the query to formData if it exists
        if (currentMessage.trim()) {
          formData.append("query", currentMessage)
        }

        response = await axios.post("https://4330-49-249-18-30.ngrok-free.app/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "ngrok-skip-browser-warning": "true",
          },
        })

        // Clear uploaded files after sending
        setUploadedFiles([])
        setUploadedFileNames([])
      } else {
        // Just sending a text query without files
        response = await axios.post(
          "https://4330-49-249-18-30.ngrok-free.app/",
          { query: currentMessage },
          {
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true",
            },
          },
        )
      }

      console.log("API ", response) // full response
      console.log("API Data:", response.data) // only data part

      if (response.data) {
        onAIResponse(response.data)
      } else {
        onAIResponse("No answer returned from the API.")
      }
    } catch (error) {
      console.error("API call failed:", error)
      toast({
        title: "API Error",
        description: "Failed to get a response from the AI.",
        variant: "destructive",
      })
      onAIResponse("An error occurred while contacting the API.")
    } finally {
      setIsQuerying(false)
      setIsLoading(false)
    }
  }

  const handleFileSelected = (file: File) => {
    setUploadedFiles((prev) => [...prev, file])
    setUploadedFileNames((prev) => [...prev, file.name])
  }

  const removeFile = (index: number) => {
    const newFiles = [...uploadedFiles]
    newFiles.splice(index, 1)
    setUploadedFiles(newFiles)

    const newFileNames = [...uploadedFileNames]
    newFileNames.splice(index, 1)
    setUploadedFileNames(newFileNames)
  }

  return (
    <div className="w-full">
      <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
        <button className="px-4 py-1.5 text-sm border border-gray-300 rounded-full hover:bg-gray-50 whitespace-nowrap">
          Compare Documents
        </button>
        <button className="px-4 py-1.5 text-sm border border-gray-300 rounded-full hover:bg-gray-50 whitespace-nowrap">
          Show missing clause suggestion
        </button>
        <button className="px-4 py-1.5 text-sm border border-gray-300 rounded-full hover:bg-gray-50 whitespace-nowrap">
          Add new clause
        </button>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {uploadedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-sm shadow-sm"
            >
              <FileText size={14} className="text-gray-500" />
              <span className="max-w-[100px] h-[25px] truncate">{file.name}</span>
              <button onClick={() => removeFile(index)} className="text-gray-400 hover:text-red-500 text-xs">
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2">
        <FileUpload onFileSelected={handleFileSelected} />

        <input
          type="text"
          placeholder="Message"
          className="flex-1 outline-none text-sm"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              handleSendMessage()
            }
          }}
        />

        <div className="flex items-center gap-2">
          <button
            className="bg-blue-600 text-white rounded-full p-1.5 hover:bg-blue-700 disabled:opacity-50"
            onClick={handleSendMessage}
            disabled={isQuerying || (!message.trim() && uploadedFiles.length === 0)}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
