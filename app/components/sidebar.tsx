import { ChevronDown } from "lucide-react"

interface RecentSearchItem {
  title: string
  timestamp: string
}

export function Sidebar() {
  const recentSearches: RecentSearchItem[] = [
    { title: "Generate a section 112 format", timestamp: "2h ago" },
    { title: "Complixi SICP Tutorial course", timestamp: "2h ago" },
    { title: "Proxy failure troubleshooting", timestamp: "2h ago" },
    { title: "Wake me up when september ends", timestamp: "2h ago" },
    { title: "Best Oasis songs top 100 of all time", timestamp: "2h ago" },
    { title: "Fix SSL/TLS Error", timestamp: "2h ago" },
  ]

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col h-full">
      <h1 className="text-lg font-bold mb-6">Legal AI</h1>

      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-medium text-gray-700">Recent Searches</h2>
        <ChevronDown size={16} className="text-gray-500" />
      </div>

      <div className="flex-1 overflow-auto">
        {recentSearches.map((item, index) => (
          <div key={index} className="py-2 border-b border-gray-100 last:border-0">
            <p className="text-sm text-gray-800 mb-1">{item.title}</p>
            <p className="text-xs text-gray-500">{item.timestamp}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

