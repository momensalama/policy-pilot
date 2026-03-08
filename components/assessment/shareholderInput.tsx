"use client";

import { motion, AnimatePresence } from "motion/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Divide, Plus, Trash2 } from "lucide-react";
import type { ShareholderFormData } from "@/lib/validations";

interface ShareholderInputProps {
  shareholders: ShareholderFormData[];
  onChange: (shareholders: ShareholderFormData[]) => void;
  error?: string;
}

const roundPercent = (value: number) => Math.round(value * 100) / 100;

const parsePercentageInput = (raw: string) =>
  roundPercent(Number.parseFloat(raw) || 0);

export function ShareholderInput({
  shareholders,
  onChange,
  error,
}: Readonly<ShareholderInputProps>) {
  const total = shareholders.reduce(
    (sum, s) => sum + (s.sharePercentage ?? 0),
    0,
  );

  const addShareholder = () => {
    onChange([...shareholders, { name: "", sharePercentage: 0 }]);
  };

  const removeShareholder = (index: number) => {
    onChange(shareholders.filter((_, i) => i !== index));
  };

  const updateName = (index: number, name: string) => {
    onChange(shareholders.map((s, i) => (i === index ? { ...s, name } : s)));
  };

  const updatePercentage = (index: number, raw: string) => {
    const value = parsePercentageInput(raw);

    onChange(
      shareholders.map((s, i) =>
        i === index ? { ...s, sharePercentage: value } : s,
      ),
    );
  };

  const roundedTotal = roundPercent(total);
  const isExact = roundedTotal === 100;

  const autoDistribute = () => {
    const count = shareholders.length;
    if (count === 0) return;
    const base = Math.floor(10000 / count) / 100;
    let distributed = 0;
    onChange(
      shareholders.map((s, i) => {
        const share =
          i === count - 1 ? Math.round((100 - distributed) * 100) / 100 : base;
        distributed += share;
        return { ...s, sharePercentage: share };
      }),
    );
  };

  return (
    <div className="space-y-3">
      <AnimatePresence initial={false}>
        {shareholders.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex items-start gap-2 sm:gap-3"
          >
            <div className="flex-1">
              <Input
                placeholder="Shareholder name"
                value={s.name}
                onChange={(e) => updateName(i, e.target.value)}
              />
            </div>
            <div className="w-24 sm:w-28">
              <Input
                type="number"
                placeholder="%"
                min={0}
                max={100}
                value={s.sharePercentage || ""}
                onChange={(e) => updatePercentage(i, e.target.value)}
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeShareholder(i)}
              className="mt-0.5 shrink-0 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addShareholder}
          className="flex-1"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add shareholder
        </Button>
        {shareholders.length > 0 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={autoDistribute}
          >
            <Divide className="mr-2 h-4 w-4" />
            Auto-distribute
          </Button>
        )}
      </div>

      {/* Running total */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Total shares</span>
        <span
          className={
            isExact
              ? "font-medium text-green-600"
              : "font-medium text-destructive"
          }
        >
          {roundedTotal}%
          {!isExact &&
            roundedTotal < 100 &&
            ` (${(100 - roundedTotal).toFixed(2)}% remaining)`}
          {!isExact &&
            roundedTotal > 100 &&
            ` (${(roundedTotal - 100).toFixed(2)}% over)`}
        </span>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
