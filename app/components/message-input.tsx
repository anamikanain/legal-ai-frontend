"use client"
import { useState } from "react"
import { Send, FileText } from "lucide-react"
import { FileUpload } from "./file-upload"
import { useToast } from "./ui/use-toast"
import axios from "axios"

interface MessageInputProps {
  onSendMessage: (message: string) => void
  onAIResponse: (response: any) => void
  setIsLoading: (loading: boolean) => void
}

export function MessageInput({ onSendMessage, onAIResponse, setIsLoading }: MessageInputProps) {
  const [message, setMessage] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [uploadedFileNames, setUploadedFileNames] = useState<string[]>([])
  const [isQuerying, setIsQuerying] = useState(false)
  const { toast } = useToast()

  const handleSendMessage = async () => {
    const trimmedMessage = message.trim()
    const hasFiles = uploadedFiles.length > 0
    const hasMessage = !!trimmedMessage
  
    if (!hasMessage && !hasFiles) return
  
    const API_URL = "https://7340-49-249-18-30.ngrok-free.app/"
    const headersBase = {
      "ngrok-skip-browser-warning": "true",
    }
  
    const combinedMessage = `${message}${uploadedFileNames.length ? ` | ${uploadedFileNames.join(", ")}` : ""}`
    onSendMessage(combinedMessage)
  
    setMessage("")
    setIsQuerying(true)
    setIsLoading(true)
  
    try {
      const data = hasFiles
        ? (() => {
            const formData = new FormData()
            uploadedFiles.forEach(file => formData.append("document", file))
            if (hasMessage) formData.append("query", trimmedMessage)
            return formData
          })()
        : { query: trimmedMessage }
  
      const headers = {
        ...headersBase,
        "Content-Type": hasFiles ? "multipart/form-data" : "application/json",
      }
  
      const response = await axios.post(API_URL, data, { headers })
  
      if (hasFiles) {
        setUploadedFiles([])
        setUploadedFileNames([])
      }
  
      onAIResponse(response.data || "No answer returned from the API.")
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

        <textarea
          placeholder="Message"
          className="flex-1 outline-none text-sm h-6 leading-tight resize-none bg-transparent"
          rows={3}
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
