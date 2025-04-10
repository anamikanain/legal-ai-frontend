import { Copy, Clock, CheckCheck } from "lucide-react";
import { DocumentDownload } from "./document-download";
import React from "react";
import ReactMarkdown from "react-markdown";
interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: string;
}
interface ChatInterfaceProps {
  messages: Message[];
}
export function ChatInterface({ messages }: ChatInterfaceProps) {
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
                <span className="text-xs text-gray-400">
                  {message.timestamp}
                </span>
              </div>
            </div>
          </div>
        ) : (
          // AI message
          <div key={message.id} className="flex items-start gap-3">
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "76.88px",
                background: "#D2D6E3",
              }}
              className="flex-shrink-0 flex items-center justify-center"
            >
              <span className="text-xs font-medium">LA</span>
            </div>
            <div className="flex-1">
              <div className="bg-white p-4 rounded-lg shadow-sm prose prose-sm max-w-none">
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
              <div className="flex items-center mt-1">
                <Clock size={12} className="text-gray-400 mr-1" />
                <span className="text-xs text-gray-400">{message.timestamp}</span>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}