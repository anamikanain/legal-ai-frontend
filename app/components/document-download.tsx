import { FileText, FileDown } from "lucide-react"

export function DocumentDownload() {
  return (
    <div className="flex gap-3">
      <button className="flex items-center gap-2 border border-gray-200 rounded-md px-3 py-2 text-sm hover:bg-gray-50 transition-colors">
        <div className="flex items-center justify-center w-6 h-6 bg-blue-100 rounded">
          <FileText size={16} className="text-blue-600" />
        </div>
        <span>Word Document</span>
        <FileDown size={16} className="text-gray-400" />
      </button>

      <button className="flex items-center gap-2 border border-gray-200 rounded-md px-3 py-2 text-sm hover:bg-gray-50 transition-colors">
        <div className="flex items-center justify-center w-6 h-6 bg-red-100 rounded">
          <FileText size={16} className="text-red-600" />
        </div>
        <span>PDF Document</span>
        <FileDown size={16} className="text-gray-400" />
      </button>
    </div>
  )
}

