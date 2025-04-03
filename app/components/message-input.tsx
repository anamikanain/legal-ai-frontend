"use client"

import { useState } from "react"
import { Send } from "lucide-react"
import { FileUpload } from "./file-upload"
import { useToast } from "./ui/use-toast"

interface MessageInputProps {
  onSendMessage: (message: string) => void
  onAIResponse: (response: string) => void
}

export function MessageInput({ onSendMessage, onAIResponse }: MessageInputProps) {
  const [message, setMessage] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  const [isQuerying, setIsQuerying] = useState(false)
  const { toast } = useToast()

  const handleSendMessage = async () => {
    if (!message.trim()) return

    // First send the message to the UI
    onSendMessage(message)

    // If we have uploaded files, simulate document querying
    if (uploadedFiles.length > 0) {
      setIsQuerying(true)

      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Generate a response based on the message and uploaded files
        let aiResponse = ""

        // Check for specific keywords to simulate different responses
        if (message.toLowerCase().includes("format") || message.toLowerCase().includes("section")) {
          aiResponse = "Section II: [Title of the Section]"
        } else if (message.toLowerCase().includes("download")) {
          aiResponse = "You can download this format in:"
        } else {
          // Generic response about the document
          aiResponse = `Based on the ${uploadedFiles.length} document${uploadedFiles.length > 1 ? "s" : ""} you've uploaded, I can help with your query about "${message}". What specific information are you looking for?`
        }

        onAIResponse(aiResponse)
      } catch (error) {
        console.error("Error querying documents:", error)
        toast({
          title: "Query failed",
          description: error instanceof Error ? error.message : "An unknown error occurred",
          variant: "destructive",
        })
      } finally {
        setIsQuerying(false)
      }
    } else {
      // If no files uploaded, simulate a generic AI response
      setTimeout(() => {
        onAIResponse(`I'm processing your request about: ${message}`)
      }, 1000)
    }

    setMessage("")
  }

  const handleFileProcessed = (fileName: string) => {
    setUploadedFiles((prev) => [...prev, fileName])
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
        <div className="mb-2 flex flex-wrap gap-2">
          {uploadedFiles.map((fileName, index) => (
            <div key={index} className="bg-gray-100 px-3 py-1 rounded-full text-xs flex items-center">
              <span>{fileName}</span>
              <button
                className="ml-2 text-gray-500 hover:text-gray-700"
                onClick={() => {
                  const newFiles = [...uploadedFiles]
                  newFiles.splice(index, 1)
                  setUploadedFiles(newFiles)
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2">
        <FileUpload onFileProcessed={handleFileProcessed} />

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
          </button>
          <button
            className="bg-blue-600 text-white rounded-full p-1.5 hover:bg-blue-700 disabled:opacity-50"
            onClick={handleSendMessage}
            disabled={isQuerying || !message.trim()}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

