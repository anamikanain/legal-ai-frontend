"use client";

import type React from "react";

import { Clock, Download } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { ChatLoader } from "./chat-loader";
import { Button } from "./ui/button";
import { jsPDF } from "jspdf";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: string;
}

interface ChatInterfaceProps {
  messages: Message[];
  isLoading?: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  isLoading,
}) => {
  const downloadResponse = (content: string, format: "pdf" | "doc") => {
    try {
      if (format === "pdf") {
        const doc = new jsPDF();
        const marginLeft = 15;
        const marginTop = 15;
        const lineHeight = 10; // space between lines
        const pageHeight = doc.internal.pageSize.height;

        const splitText = doc.splitTextToSize(content, 180);
        let currentHeight = marginTop;

        splitText.forEach((line: any) => {
          if (currentHeight + lineHeight > pageHeight - marginTop) {
            doc.addPage();
            currentHeight = marginTop;
          }
          doc.text(line, marginLeft, currentHeight);
          currentHeight += lineHeight;
        });

        doc.save(`Document.pdf`);
      } else {
        const blob = new Blob([content], { type: "application/msword" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `Document.doc`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error(`${format.toUpperCase()} download failed:`, error);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {messages.map((message) =>
        message.role === "user" ? (
          // User message
          <div key={message.id} className="flex items-start justify-end gap-3">
            <div className="flex-1 max-w-[80%]">
              <div className="bg-black text-white p-3 rounded-lg shadow-sm">
                <p className="text-sm">{message.content}</p>
              </div>
              <div className="flex items-center mt-1">
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
              <div className="flex items-center mt-1 gap-3">
                <div className="flex items-center">
                  <Clock size={12} className="text-gray-400 mr-1" />
                  <span className="text-xs text-gray-400">
                    {message.timestamp}
                  </span>
                </div>
                {message.content !==
                  "Hello! I'm your personal AI Assistant Strategist." && (
                  <div className="flex gap-2 mt-3">
                    {["pdf", "doc"].map((format) => (
                      <Button
                        key={format}
                        variant="outline"
                        size="sm"
                        className="h-10 px-4 text-xs font-medium flex items-center gap-1 rounded-md border-gray-300 hover:bg-gray-100 transition"
                        onClick={() =>
                          downloadResponse(
                            message.content,
                            format as "pdf" | "doc"
                          )
                        }
                      >
                        <Download size={14} className="text-gray-600" />
                        {format.toUpperCase()}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      )}

      {isLoading && (
        <div className="flex items-start gap-3">
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "76.88px",
              background: "#D2D6E3",
            }}
            className="flex-shrink-0"
          ></div>
          <ChatLoader />
        </div>
      )}
    </div>
  );
};
