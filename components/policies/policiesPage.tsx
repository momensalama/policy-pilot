"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronDown, Trash2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PolicySidebar } from "./policySidebar";
import { PolicyEditor } from "./policyEditor";
import { deletePolicy } from "@/app/actions/policies";
import type { Policy } from "@/db/schema";

interface PoliciesPageProps {
  policies: Policy[];
}

export function PoliciesPageClient({
  policies: initialPolicies,
}: Readonly<PoliciesPageProps>) {
  const router = useRouter();
  const [policies, setPolicies] = useState(initialPolicies);
  const [selectedId, setSelectedId] = useState(initialPolicies[0]?.id ?? "");
  const [isPending, startTransition] = useTransition();

  const selectedPolicy = policies.find((p) => p.id === selectedId);

  const handleDeleted = (id: string) => {
    const deletedIndex = policies.findIndex((p) => p.id === id);
    const remaining = policies.filter((p) => p.id !== id);
    setPolicies(remaining);

    if (remaining.length === 0) {
      router.push("/chat");
      return;
    }

    if (selectedId === id) {
      const nextIndex = Math.min(deletedIndex, remaining.length - 1);
      setSelectedId(remaining[nextIndex].id);
    }
  };

  const handleMobileDelete = () => {
    if (!selectedPolicy) return;
    const id = selectedPolicy.id;
    startTransition(async () => {
      try {
        await deletePolicy(id);
        handleDeleted(id);
        toast.success("Policy deleted");
      } catch {
        toast.error("Failed to delete policy");
      }
    });
  };

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
        <div className="flex h-14 items-center gap-3 px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/chat")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-sm font-semibold">Policies</h1>
        </div>
      </header>

      {/* Mobile: policy selector + delete */}
      <div className="md:hidden border-b px-4 py-3 flex items-center gap-2">
        <div className="relative flex-1">
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="w-full appearance-none rounded-lg border bg-background px-3 py-2 pr-8 text-sm"
          >
            {policies.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 text-destructive" />
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete policy?</AlertDialogTitle>
              <AlertDialogDescription>
                &quot;{selectedPolicy?.title}&quot; will be permanently deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleMobileDelete}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar */}
        <aside className="w-64 shrink-0 border-r overflow-y-auto p-3 hidden md:block">
          <PolicySidebar
            policies={policies}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onDeleted={handleDeleted}
          />
        </aside>

        {/* Editor */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {selectedPolicy && (
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-4 text-lg font-semibold hidden md:block">
                {selectedPolicy.title}
              </h2>
              <PolicyEditor
                key={selectedPolicy.id}
                policyId={selectedPolicy.id}
                content={selectedPolicy.content}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
