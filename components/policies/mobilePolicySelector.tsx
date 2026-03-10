"use client";

import { useTransition } from "react";
import { ChevronDown, Trash2, Loader2 } from "lucide-react";
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
import { deletePolicy } from "@/app/actions/policies";
import type { Policy } from "@/db/schema";

interface MobilePolicySelectorProps {
  policies: Policy[];
  selectedId: string;
  onSelect: (id: string) => void;
  onDeleted: (id: string) => void;
}

export function MobilePolicySelector({
  policies,
  selectedId,
  onSelect,
  onDeleted,
}: Readonly<MobilePolicySelectorProps>) {
  const [isPending, startTransition] = useTransition();
  const selectedPolicy = policies.find((p) => p.id === selectedId);

  const handleDelete = () => {
    if (!selectedPolicy) return;
    const id = selectedPolicy.id;

    startTransition(async () => {
      try {
        await deletePolicy(id);
        onDeleted(id);
        toast.success("Policy deleted");
      } catch {
        toast.error("Failed to delete policy");
      }
    });
  };

  return (
    <div className="flex items-center gap-2 border-b px-4 py-3 md:hidden">
      <div className="relative flex-1">
        <select
          value={selectedId}
          onChange={(e) => onSelect(e.target.value)}
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
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
