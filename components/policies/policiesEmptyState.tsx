"use client";

import { useRouter } from "next/navigation";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PoliciesEmptyState() {
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
        <FileText className="h-7 w-7 text-muted-foreground" />
      </div>
      <div>
        <h2 className="text-lg font-semibold">No policies yet</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Generate your first policy from the chat.
        </p>
      </div>
      <Button variant="outline" onClick={() => router.push("/chat")}>
        Go to Chat
      </Button>
    </div>
  );
}
