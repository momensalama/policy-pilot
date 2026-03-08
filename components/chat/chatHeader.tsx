"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Building2, FileText, Pencil, Trash2, Loader2 } from "lucide-react";
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

import { deleteAssessment } from "@/app/actions/assessment";
import { clearMessages } from "@/app/actions/chat";

interface ChatHeaderProps {
  companyName: string;
  assessmentId: string;
}

export function ChatHeader({
  companyName,
  assessmentId,
}: Readonly<ChatHeaderProps>) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await clearMessages();
        await deleteAssessment(assessmentId);
        toast.success("Assessment deleted");
        router.push("/assessment");
      } catch {
        toast.error("Failed to delete assessment");
      }
    });
  };

  return (
    <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-primary" />
          <h1 className="text-sm font-semibold truncate max-w-[160px] sm:max-w-none">
            {companyName}
          </h1>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/policies")}
            title="View Policies"
          >
            <FileText className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/assessment?edit=true")}
            title="Edit Assessment"
          >
            <Pencil className="h-4 w-4" />
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                title="Delete Assessment"
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
                <AlertDialogTitle>Delete assessment?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the assessment, all chat history,
                  and generated policies. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </header>
  );
}
