"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import type { UIMessage } from "ai";
import toast from "react-hot-toast";

import { ChatHeader } from "./chatHeader";
import { ChatMessages } from "./chatMessages";
import { ChatInput } from "./chatInput";

interface ChatInterfaceProps {
  companyName: string;
  assessmentId: string;
  initialMessages: UIMessage[];
}

const transport = new DefaultChatTransport({ api: "/api/chat" });

export function ChatInterface({
  companyName,
  assessmentId,
  initialMessages,
}: Readonly<ChatInterfaceProps>) {
  const [input, setInput] = useState("");

  const { messages, sendMessage, status } = useChat({
    messages: initialMessages,
    transport,
    onError: () => {
      toast.error("Failed to get a response");
    },
  });

  const isStreaming = status === "streaming" || status === "submitted";

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;
    sendMessage({ text: trimmed });
    setInput("");
  };

  return (
    <div className="flex h-screen flex-col">
      <ChatHeader companyName={companyName} assessmentId={assessmentId} />

      <ChatMessages messages={messages} isStreaming={status === "submitted"} />

      <ChatInput
        value={input}
        onChange={setInput}
        onSubmit={handleSubmit}
        disabled={isStreaming}
      />
    </div>
  );
}
