"use client";

import { useEffect, useRef } from "react";
import type { UIMessage } from "ai";
import { MessageBubble } from "./MessageBubble";
import { ChatWelcome } from "./chatWelcome";

interface ChatMessagesProps {
  messages: UIMessage[];
  isStreaming: boolean;
  companyName: string;
  onSuggestionClick: (prompt: string) => void;
}

export function ChatMessages({
  messages,
  isStreaming,
  companyName,
  onSuggestionClick,
}: Readonly<ChatMessagesProps>) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <ChatWelcome
        companyName={companyName}
        onSuggestionClick={onSuggestionClick}
      />
    );
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto p-4">
      <div className="mx-auto max-w-3xl space-y-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {isStreaming && (
          <div className="flex gap-1 px-4 py-2">
            <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:0ms]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:150ms]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:300ms]" />
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
