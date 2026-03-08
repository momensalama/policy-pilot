"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
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
    const remaining = policies.filter((p) => p.id !== id);
    setPolicies(remaining);

    if (remaining.length === 0) {
      router.push("/chat");
      return;
    }

    if (selectedId === id) {
      setSelectedId(remaining[0].id);
    }
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

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 shrink-0 border-r overflow-y-auto p-3 hidden md:block">
          <PolicySidebar
            policies={policies}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onDeleted={handleDeleted}
          />
        </aside>

        {/* Mobile select */}
        <div className="md:hidden border-b p-3">
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
          >
            {policies.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>

        {/* Editor */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {selectedPolicy && (
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-4 text-lg font-semibold">
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
