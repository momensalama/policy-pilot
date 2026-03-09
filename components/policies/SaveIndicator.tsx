import { Loader2, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export type SaveStatus = "idle" | "saving" | "saved";

export function SaveIndicator({ status }: Readonly<{ status: SaveStatus }>) {
  return (
    <div className="flex items-center gap-1.5 pr-3 text-xs text-muted-foreground h-8">
      <AnimatePresence mode="wait">
        {status === "saving" && (
          <motion.div
            key="saving"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-1.5"
          >
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Saving...</span>
          </motion.div>
        )}
        {status === "saved" && (
          <motion.div
            key="saved"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-1.5 text-green-600"
          >
            <Check className="h-3 w-3" />
            <span>Saved</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
