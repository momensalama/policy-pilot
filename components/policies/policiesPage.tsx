"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PoliciesEmptyState } from "./policiesEmptyState";
import { MobilePolicySelector } from "./mobilePolicySelector";
import { PolicySidebar } from "./policySidebar";
import { PolicyEditor } from "./policyEditor";
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

  const selectedPolicy = policies.find((p) => p.id === selectedId);

  const handleDeleted = (id: string) => {
    const deletedIndex = policies.findIndex((p) => p.id === id);
    const remaining = policies.filter((p) => p.id !== id);
    setPolicies(remaining);

    if (remaining.length === 0) {
      setSelectedId("");
      return;
    }

    if (selectedId === id) {
      const nextIndex = Math.min(deletedIndex, remaining.length - 1);
      setSelectedId(remaining[nextIndex].id);
    }
  };

  return (
    <div className="flex h-screen flex-col">
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

      {policies.length === 0 ? (
        <PoliciesEmptyState />
      ) : (
        <>
          <MobilePolicySelector
            policies={policies}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onDeleted={handleDeleted}
          />

          <div className="flex flex-1 overflow-hidden">
            <aside className="hidden w-64 shrink-0 overflow-y-auto border-r p-3 md:block">
              <PolicySidebar
                policies={policies}
                selectedId={selectedId}
                onSelect={setSelectedId}
                onDeleted={handleDeleted}
              />
            </aside>

            <main className="flex-1 overflow-y-auto p-4 md:p-6">
              {selectedPolicy && (
                <div className="mx-auto max-w-4xl">
                  <h2 className="mb-4 hidden text-lg font-semibold md:block">
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
        </>
      )}
    </div>
  );
}
