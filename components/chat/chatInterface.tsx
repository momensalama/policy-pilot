"use client";

import { useState, useEffect, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { TextStreamChatTransport } from "ai";
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

const transport = new TextStreamChatTransport({ api: "/api/chat" });

export function ChatInterface({
  companyName,
  assessmentId,
  initialMessages,
}: Readonly<ChatInterfaceProps>) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { messages, sendMessage, status } = useChat({
    messages: initialMessages,
    transport,
    onError: () => {
      toast.error("Failed to get a response");
    },
  });

  const isStreaming = status === "streaming" || status === "submitted";
  const prevStatusRef = useRef(status);

  useEffect(() => {
    const wasStreaming =
      prevStatusRef.current === "streaming" ||
      prevStatusRef.current === "submitted";

    if (wasStreaming && status === "ready") {
      inputRef.current?.focus();
    }

    prevStatusRef.current = status;
  }, [status]);

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;
    sendMessage({ text: trimmed });
    setInput("");
  };

  return (
    <div className="flex h-screen flex-col overflow-x-hidden">
      <ChatHeader companyName={companyName} assessmentId={assessmentId} />

      <ChatMessages
        messages={messages}
        isStreaming={status === "submitted"}
        companyName={companyName}
        onSuggestionClick={(prompt) => {
          setInput(prompt);
          inputRef.current?.focus();
        }}
      />

      <ChatInput
        value={input}
        onChange={setInput}
        onSubmit={handleSubmit}
        disabled={isStreaming}
        inputRef={inputRef}
      />
    </div>
  );
}
