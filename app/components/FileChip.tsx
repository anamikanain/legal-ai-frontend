import { X } from "lucide-react"
import { useState } from "react"

export const FileChip = ({ fileName, onRemove }: { fileName: string; onRemove: () => void }) => {
  const getTruncatedName = (name: string, maxLength = 20) =>
    name.length > maxLength ? `${name.slice(0, maxLength)}...` : name

  return (
    <div className="flex items-center px-3 py-1.5 bg-gray-100 rounded-full text-sm font-medium space-x-2 shadow-sm">
      <span className="text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis max-w-[140px] flex items-center gap-1">
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m2 6H7a2 2 0 01-2-2V8a2 2 0 012-2h5l2 2h4a2 2 0 012 2v8a2 2 0 01-2 2z" />
        </svg>
        {getTruncatedName(fileName)}
      </span>
      <button
        onClick={onRemove}
        className="text-gray-500 hover:text-red-500 transition"
        aria-label="Remove file"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
