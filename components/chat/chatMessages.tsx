"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import type { UIMessage } from "ai";

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
        <p className="text-center text-sm text-muted-foreground">
          Ask a question about your company or request a policy to get started.
        </p>
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

function MessageBubble({ message }: { message: UIMessage }) {
  const isUser = message.role === "user";

  const text = message.parts
    .filter((p) => p.type === "text")
    .map((p) => p.text)
    .join("");

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn("flex", isUser ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground",
        )}
      >
        {isUser ? (
          <div className="whitespace-pre-wrap break-words">{text}</div>
        ) : (
          <div className="prose prose-sm max-w-none break-words
              prose-headings:font-semibold prose-headings:mt-3 prose-headings:mb-1
              prose-p:my-1 prose-p:leading-relaxed
              prose-ul:my-1 prose-ul:pl-4 prose-li:my-0.5
              prose-ol:my-1 prose-ol:pl-4
              prose-code:rounded prose-code:bg-black/10 prose-code:px-1 prose-code:py-0.5 prose-code:text-xs
              prose-pre:rounded-lg prose-pre:bg-black/10 prose-pre:p-3 prose-pre:text-xs prose-pre:overflow-x-auto
              prose-strong:font-semibold
              prose-hr:my-2">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {text}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </motion.div>
  );
}
