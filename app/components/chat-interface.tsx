import { Copy, Clock } from "lucide-react"
import { DocumentDownload } from "./document-download"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: string
}

interface ChatInterfaceProps {
  messages: Message[]
}

export function ChatInterface({ messages }: ChatInterfaceProps) {
  // Special formatting for the section format message
  const formatSectionContent = (content: string) => {
    if (content.includes("Section II:")) {
      return (
        <div className="space-y-4 text-sm text-gray-700">
          <h3 className="text-sm font-medium mb-2">Section II: [Title of the Section]</h3>

          <div>
            <p className="mb-1 font-medium">II.1 [Subheading or Clause Title]</p>
            <p className="text-xs">
              [Describe the main purpose of this section, clause, or subheading. You can provide legal obligations for
              the matters covered. Example: Responsibilities of the parties, the terms of performance, conditions to be
              met, etc.]
            </p>
          </div>

          <div>
            <p className="mb-1 font-medium">II.2 [Subheading or Clause Title]</p>
            <p className="text-xs">
              [Describe one or more additional subheading or clause. This part can clarify further obligations or
              additional responsibilities, including rights, prohibitions, or limitations imposed.]
            </p>
          </div>

          <div>
            <p className="mb-1 font-medium">II.3 [Subheading or Clause Title]</p>
            <p className="text-xs">
              [Further details or a new subsection to expand on the topic. Could involve consequences, timelines, or
              procedures related to the subject of the section.]
            </p>
          </div>

          <div>
            <p className="mb-1 font-medium">II.4 [Subheading or Clause Title]</p>
            <p className="text-xs">[Any additional clauses or elements that are essential for this section.]</p>
          </div>

          <div>
            <p className="mb-1 font-medium">II.5 Dispute Resolution/Legal Proceedings (if applicable)</p>
            <p className="text-xs">
              [Include a clause specifying how disputes arising from this section will be handled. This could include
              mediation, arbitration, or jurisdiction clauses for resolution.]
            </p>
          </div>

          <div>
            <p className="mb-1 font-medium">II.6 [Termination or Conditions for Breach]</p>
            <p className="text-xs">
              [Explanation of what happens if any party fails to fulfill obligations related to this section. It may
              include conditions for termination or penalties.]
            </p>
          </div>

          <div>
            <p className="mb-1 font-medium">II.7 Governing Law</p>
            <p className="text-xs">
              [Specify the jurisdiction and the governing law under which the section is enforceable.]
            </p>
          </div>

          <div className="mt-4 flex items-center text-xs text-gray-500">
            <Copy size={14} className="mr-1" />
            <span>Copy to clipboard</span>
          </div>
        </div>
      )
    }

    // Check if this is the download message
    if (content.includes("download this format")) {
      return (
        <>
          <p className="text-sm text-gray-800 mb-3">{content}</p>
          <DocumentDownload />
        </>
      )
    }

    // Default rendering for regular messages
    return <p className="text-sm text-gray-800">{content}</p>
  }

  return (
    <div className="space-y-6">
      {messages.map((message) =>
        message.role === "user" ? (
          // User message
          <div key={message.id} className="flex items-start justify-end gap-3">
            <div className="flex-1 max-w-[80%]">
              <div className="bg-black text-white p-3 rounded-lg shadow-sm">
                <p className="text-sm">{message.content}</p>
              </div>
              <div className="flex items-center justify-end mt-1">
                <Clock size={12} className="text-gray-400 mr-1" />
                <span className="text-xs text-gray-400">{message.timestamp}</span>
              </div>
            </div>
            <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
              <img src="/placeholder.svg?height=32&width=32" alt="User" className="w-full h-full object-cover" />
            </div>
          </div>
        ) : (
          // AI message
          <div key={message.id} className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium">LA</span>
            </div>
            <div className="flex-1">
              <div className="bg-white p-4 rounded-lg shadow-sm">{formatSectionContent(message.content)}</div>
              <div className="flex items-center mt-1">
                <Clock size={12} className="text-gray-400 mr-1" />
                <span className="text-xs text-gray-400">{message.timestamp}</span>
              </div>
            </div>
          </div>
        ),
      )}
    </div>
  )
}

