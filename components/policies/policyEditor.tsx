"use client";

import { useEffect, useRef, useCallback } from "react";
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

interface PolicyEditorProps {
  policyId: string;
  content: string;
}

export function PolicyEditor({
  policyId,
  content,
}: Readonly<PolicyEditorProps>) {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const saveContent = useCallback(
    (html: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(async () => {
        try {
          await updatePolicy(policyId, html);
        } catch {
          toast.error("Failed to save");
        }
      }, AUTOSAVE_DELAY);
    },
    [policyId],
  );

  const editor = useEditor({
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
  }, [policyId, content, editor]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  if (!editor) return null;

  return (
    <div className="flex flex-col rounded-lg border bg-background">
      <Toolbar editor={editor} />
      <Separator />
      <EditorContent editor={editor} />
    </div>
  );
}
