"use client";

import { useRef } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MAX_HEIGHT } from "@/lib/constants";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  inputRef?: React.RefObject<HTMLTextAreaElement | null>;
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  disabled,
  inputRef,
}: Readonly<ChatInputProps>) {
  const localRef = useRef<HTMLTextAreaElement>(null);
  const textareaRef = inputRef ?? localRef;

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT)}px`;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="sticky bottom-0 border-t bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-3xl items-end gap-2 p-4">
        <textarea
          ref={textareaRef}
          autoFocus
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            autoResize();
          }}
          onKeyDown={handleKeyDown}
          placeholder="Ask about your company or request a policy..."
          disabled={disabled}
          rows={1}
          className="flex-1 resize-none rounded-lg border bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 scrollbar-none"
          style={{ maxHeight: MAX_HEIGHT }}
        />

        <Button
          size="icon"
          onClick={onSubmit}
          disabled={disabled || !value.trim()}
          className="shrink-0"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
