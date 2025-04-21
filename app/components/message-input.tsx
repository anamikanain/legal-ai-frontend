"use client"
import { useState } from "react"
import { Send, FileText, Download } from "lucide-react"
import { FileUpload } from "./file-upload"
import { useToast } from "./ui/use-toast"
import axios from "axios"
import { Button } from "./ui/button"
import { jsPDF } from "jspdf"

interface MessageInputProps {
  onSendMessage: (message: string) => void
  onAIResponse: any
  setIsLoading: (loading: boolean) => void
}

export function MessageInput({ onSendMessage, onAIResponse, setIsLoading }: MessageInputProps) {
  const [message, setMessage] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [uploadedFileNames, setUploadedFileNames] = useState<string[]>([])
  const [isQuerying, setIsQuerying] = useState(false)
  const [apiResponse, setApiResponse] = useState<any>(null)
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
          formData.append("document", file)
        })

        // Add the query to formData if it exists
        if (currentMessage.trim()) {
          formData.append("query", currentMessage)
        }

        response = await axios.post("https://a188-49-249-18-30.ngrok-free.app/", formData, {
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
          "https://a188-49-249-18-30.ngrok-free.app/",
          { query: currentMessage },
          {
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true",
            },
          },
        )
      }

      if (response.data) {
        setApiResponse(response.data)
        onAIResponse(response.data)
      } else {
        setApiResponse("No answer returned from the API.")
        onAIResponse("No answer returned from the API.")
      }
    } catch (error) {
      console.error("API call failed:", error)
      toast({
        title: "API Error",
        description: "Failed to get a response from the AI.",
        variant: "destructive",
      })
      setApiResponse("An error occurred while contacting the API.")
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

  const downloadAsPDF = () => {
    if (!apiResponse) {
      toast({
        title: "No content to download",
        description: "Please get a response first before downloading.",
        variant: "destructive",
      })
      return
    }

    try {
      const doc = new jsPDF()

      // Format the response content
      const content = typeof apiResponse === "object" ? JSON.stringify(apiResponse, null, 2) : String(apiResponse)

      // Split content into lines to fit PDF page width
      const splitText = doc.splitTextToSize(content, 180)

      doc.text(splitText, 15, 15)
      doc.save("api-response.pdf")

      toast({
        title: "Download successful",
        description: "PDF has been downloaded successfully.",
      })
    } catch (error) {
      console.error("PDF download failed:", error)
      toast({
        title: "Download failed",
        description: "Failed to generate PDF file.",
        variant: "destructive",
      })
    }
  }

  const downloadAsDoc = () => {
    if (!apiResponse) {
      toast({
        title: "No content to download",
        description: "Please get a response first before downloading.",
        variant: "destructive",
      })
      return
    }

    try {
      // Format the response content
      const content = typeof apiResponse === "object" ? JSON.stringify(apiResponse, null, 2) : String(apiResponse)

      // Create a Blob with the content
      const blob = new Blob([content], { type: "application/msword" })

      // Create a download link
      const link = document.createElement("a")
      link.href = URL.createObjectURL(blob)
      link.download = "api-response.doc"

      // Append to the document, click it, and remove it
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Download successful",
        description: "DOC file has been downloaded successfully.",
      })
    } catch (error) {
      console.error("DOC download failed:", error)
      toast({
        title: "Download failed",
        description: "Failed to generate DOC file.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="w-full">
      <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
        {apiResponse && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={downloadAsPDF} className="flex items-center gap-1">
              <Download size={14} />
              PDF
            </Button>
            <Button variant="outline" size="sm" onClick={downloadAsDoc} className="flex items-center gap-1">
              <Download size={14} />
              DOC
            </Button>
          </div>
        )}
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
