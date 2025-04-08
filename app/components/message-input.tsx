"use client"

import { useState } from "react"
import { Send, Smile } from "lucide-react"
import { FileUpload } from "./file-upload"
import { useToast } from "./ui/use-toast"
import axios from "axios"

interface MessageInputProps {
  onSendMessage: (message: string) => void
  onAIResponse: (response: string) => void
}

export function MessageInput({ onSendMessage, onAIResponse }: MessageInputProps) {
  const [message, setMessage] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [uploadedFileNames, setUploadedFileNames] = useState<string[]>([])
  const [isQuerying, setIsQuerying] = useState(false)
  const { toast } = useToast()

  const handleSendMessage = async () => {
    if (!message.trim() && uploadedFiles.length === 0) return

    // First send the message to the UI
    onSendMessage(message || "Uploaded document")
    const currentMessage = message
    setMessage("")
    setIsQuerying(true)

    try {
      let response

      // If we have files to upload
      if (uploadedFiles.length > 0) {
        const formData = new FormData()
        uploadedFiles.forEach((file) => {
          formData.append("document", file)
        })

        // Add the query to formData if it exists
        if (currentMessage.trim()) {
          formData.append("query", currentMessage)
        }

        response = await axios.post("https://1a93-223-178-222-206.ngrok-free.app/", formData, {
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
          "https://1a93-223-178-222-206.ngrok-free.app/",
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

      {uploadedFileNames.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {uploadedFileNames.map((fileName, index) => (
            <div key={index} className="bg-gray-100 px-3 py-1 rounded-full text-xs flex items-center">
              <span>{fileName}</span>
              <button className="ml-2 text-gray-500 hover:text-gray-700" onClick={() => removeFile(index)}>
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
          <button className="text-gray-500 hover:text-gray-700">
            <Smile size={20} />
          </button>
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
