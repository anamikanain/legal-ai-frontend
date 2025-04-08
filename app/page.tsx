"use client";

import { useState } from "react";
import { MessageInput } from "./components/message-input";
import { Sidebar } from "./components/sidebar";
import { ChatInterface } from "./components/chat-interface";
import { Toaster } from "./components/ui/toaster";

// Define message types
interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your personal AI Assistant Strategist.",
      role: "assistant",
      timestamp: "10:15",
    },
  ]);

  const handleSendMessage = (content: string) => {
    // Generate a timestamp
    const now = new Date();
    const timestamp = `${now.getHours()}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp,
    };

    setMessages((prev) => [...prev, userMessage]);
  };

  const handleAIResponse = (content: string) => {
    // Generate a timestamp
    const now = new Date();
    const timestamp = `${now.getHours()}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

    // Add AI message
    const aiMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "assistant",
      timestamp,
    };

    setMessages((prev) => [...prev, aiMessage]);
  };

  return (
    <main className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-medium">Welcome</h1>
        </div>
        <div className="flex-1 overflow-auto px-6 pb-6">
          <ChatInterface messages={messages} />
        </div>
        <div className="p-6 border-t border-gray-200">
          <MessageInput
            onSendMessage={handleSendMessage}
            onAIResponse={handleAIResponse}
          />
        </div>
      </div>
      <Toaster />
    </main>
  );
}
