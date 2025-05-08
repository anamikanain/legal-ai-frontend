import { ChevronDown } from "lucide-react"

interface RecentSearchItem {
  title: string
  timestamp: string
}

export function Sidebar() {
  const recentSearches: RecentSearchItem[] = [
    { title: "Section 112: Format Guidelines under U.S. Code", timestamp: "1h ago" },
  { title: "Section 230: Protection for Online Platforms", timestamp: "2h ago" },
  { title: "Section 8: Housing Assistance Eligibility", timestamp: "3h ago" },
  { title: "Section 1983: Civil Action for Deprivation of Rights", timestamp: "5h ago" },
  { title: "Title IX: Education Amendments Overview", timestamp: "12h ago" },
  { title: "First Amendment: Free Speech Cases", timestamp: "22h ago" },
];
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

