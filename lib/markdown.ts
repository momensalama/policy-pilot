import { marked } from "marked";

/**
 * Converts Markdown content to HTML for Tiptap ingestion.
 * Uses synchronous parsing to avoid async complexity in editor init.
 */
export function markdownToHtml(markdown: string): string {
  return marked.parse(markdown, { async: false });
}
