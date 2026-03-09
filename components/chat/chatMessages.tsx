"use client";

import { useEffect, useRef } from "react";
import type { UIMessage } from "ai";
import { MessageBubble } from "./MessageBubble";
import { TypingAnimation } from "@/components/ui/typing-animation";

interface ChatMessagesProps {
  messages: UIMessage[];
  isStreaming: boolean;
}

export function ChatMessages({
  messages,
  isStreaming,
}: Readonly<ChatMessagesProps>) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <TypingAnimation
          as="p"
          className="text-center text-sm text-muted-foreground"
          duration={50}
          startOnView={false}
        >
          Ask a question about your company or request a policy to get started.
        </TypingAnimation>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
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
