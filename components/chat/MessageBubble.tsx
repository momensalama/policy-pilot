import { motion } from "motion/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import { cn } from "@/lib/utils";
import { UIMessage } from "ai";

export function MessageBubble({ message }: Readonly<{ message: UIMessage }>) {
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
          "max-w-[85%] min-w-0 rounded-2xl px-4 py-2.5 text-sm leading-relaxed overflow-hidden",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground",
        )}
      >
        {isUser ? (
          <div className="whitespace-pre-wrap break-words">{text}</div>
        ) : (
          <div
            className="prose prose-sm max-w-none break-words overflow-x-auto
                prose-headings:font-semibold prose-headings:mt-3 prose-headings:mb-1
                prose-p:my-1 prose-p:leading-relaxed
                prose-ul:my-1 prose-ul:pl-4 prose-li:my-0.5
                prose-ol:my-1 prose-ol:pl-4
                prose-code:rounded prose-code:bg-black/10 prose-code:px-1 prose-code:py-0.5 prose-code:text-xs
                prose-pre:rounded-lg prose-pre:bg-black/10 prose-pre:p-3 prose-pre:text-xs prose-pre:overflow-x-auto
                prose-strong:font-semibold
                prose-hr:my-2
                prose-table:block prose-table:overflow-x-auto prose-table:text-xs"
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkBreaks]}
              rehypePlugins={[rehypeRaw]}
            >
              {text}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </motion.div>
  );
}
