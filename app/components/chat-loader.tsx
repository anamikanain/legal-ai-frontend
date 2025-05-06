import { Loader2 } from "lucide-react"

export function ChatLoader() {
  return (
    <div className="flex items-start gap-3 animate-fade-in">
      <div className="flex-1">
        <div className="bg-white p-4 rounded-lg shadow-sm flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
          <p className="text-sm text-gray-500">Processing your request...</p>
        </div>
      </div>
    </div>
  )
}
