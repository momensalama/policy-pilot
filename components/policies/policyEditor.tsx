"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import toast from "react-hot-toast";

import { Separator } from "@/components/ui/separator";
import { markdownToHtml } from "@/lib/markdown";
import { updatePolicy } from "@/app/actions/policies";
import { AUTOSAVE_DELAY } from "@/lib/constants";
import { Toolbar } from "./Toolbar";
import { SaveIndicator, SaveStatus } from "./SaveIndicator";

interface PolicyEditorProps {
  policyId: string;
  content: string;
}

export function PolicyEditor({
  policyId,
  content,
}: Readonly<PolicyEditorProps>) {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  const saveContent = useCallback(
    (html: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      setSaveStatus("saving");

      debounceRef.current = setTimeout(async () => {
        try {
          await updatePolicy(policyId, html);
          setSaveStatus("saved");

          if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
          savedTimerRef.current = setTimeout(() => {
            setSaveStatus("idle");
          }, 2000);
        } catch {
          setSaveStatus("idle");
          toast.error("Failed to save");
        }
      }, AUTOSAVE_DELAY);
    },
    [policyId],
  );

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Start editing your policy..." }),
      Typography,
    ],
    content: markdownToHtml(content),
    onUpdate: ({ editor: e }) => {
      saveContent(e.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none min-h-[400px] p-4 focus:outline-none",
      },
    },
  });

  // Reset editor content when switching policies
  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      editor.commands.setContent(markdownToHtml(content));
    }
    setSaveStatus("idle");
  }, [policyId, content, editor]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
    };
  }, []);

  if (!editor) return null;

  return (
    <div className="flex flex-col rounded-lg border bg-background">
      <div className="flex items-center justify-between">
        <Toolbar editor={editor} />
        <SaveIndicator status={saveStatus} />
      </div>
      <Separator />
      <EditorContent editor={editor} />
    </div>
  );
}
