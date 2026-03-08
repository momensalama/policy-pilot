"use client";

import { useTransition } from "react";
import { motion } from "motion/react";
import { FileText, Trash2, Loader2 } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { deletePolicy } from "@/app/actions/policies";
import type { Policy } from "@/db/schema";

interface PolicySidebarProps {
  policies: Policy[];
  selectedId: string;
  onSelect: (id: string) => void;
  onDeleted: (id: string) => void;
}

export function PolicySidebar({
  policies,
  selectedId,
  onSelect,
  onDeleted,
}: Readonly<PolicySidebarProps>) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
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
    <nav className="space-y-1">
      {policies.map((policy, i) => (
        <motion.div
          key={policy.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <button
            type="button"
            onClick={() => onSelect(policy.id)}
            className={cn(
              "group flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors cursor-pointer border-0 bg-transparent",
              selectedId === policy.id
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <div className="flex items-center gap-2 min-w-0">
              <FileText className="h-4 w-4 shrink-0" />
              <span className="truncate">{policy.title}</span>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  onClick={(e) => e.stopPropagation()}
                  disabled={isPending}
                >
                  {isPending ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Trash2 className="h-3 w-3 text-destructive" />
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete policy?</AlertDialogTitle>
                  <AlertDialogDescription>
                    &quot;{policy.title}&quot; will be permanently deleted.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDelete(policy.id)}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </button>
        </motion.div>
      ))}
    </nav>
  );
}
