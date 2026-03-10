"use client";

import { motion } from "motion/react";
import {
  Building2,
  FileText,
  Scale,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const SUGGESTIONS = [
  {
    icon: Scale,
    label: "Regulations",
    prompt: "What regulations should we follow based on our primary activity?",
  },
  {
    icon: ShieldCheck,
    label: "Data Privacy Policy",
    prompt: "Generate a data privacy policy for our company.",
  },
  {
    icon: FileText,
    label: "Code of Conduct",
    prompt: "Generate an employee code of conduct policy.",
  },
  {
    icon: Sparkles,
    label: "Best Practices",
    prompt: "What are best practices for compliance in our industry?",
  },
];

const staggerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

interface ChatWelcomeProps {
  companyName: string;
  onSuggestionClick: (prompt: string) => void;
}

export function ChatWelcome({
  companyName,
  onSuggestionClick,
}: Readonly<ChatWelcomeProps>) {
  return (
    <div className="flex flex-1 items-center justify-center overflow-y-auto p-6">
      <div className="w-full max-w-2xl space-y-8">
        <motion.div
          className="flex flex-col items-center gap-4 text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
            <Building2 className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              {companyName}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Your AI compliance advisor — ask anything or generate a policy
              below.
            </p>
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 gap-3"
          initial="hidden"
          animate="visible"
          variants={staggerVariants}
        >
          {SUGGESTIONS.map(({ icon: Icon, label, prompt }) => (
            <motion.button
              key={label}
              variants={cardVariants}
              whileHover={{ y: -2, transition: { duration: 0.15 } }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSuggestionClick(prompt)}
              className="group flex cursor-pointer flex-col items-start gap-2 rounded-xl border bg-card p-4 text-left shadow-sm transition-colors hover:border-primary/30 hover:bg-accent/50"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/8 text-primary transition-colors group-hover:bg-primary/15">
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                  {prompt}
                </p>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
